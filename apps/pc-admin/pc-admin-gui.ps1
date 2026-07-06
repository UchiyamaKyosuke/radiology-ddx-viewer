param(
  [switch]$SmokeTest,
  [switch]$SmokeExport
)

Add-Type -AssemblyName System.Windows.Forms
Add-Type -AssemblyName System.Drawing
Add-Type -AssemblyName Microsoft.VisualBasic
[System.Windows.Forms.Application]::EnableVisualStyles()

$ErrorActionPreference = "Stop"
$script:Root = (Resolve-Path (Join-Path $PSScriptRoot "..\..")).Path
$script:DefaultNode = Join-Path $env:USERPROFILE ".cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe"
$script:Node = if (Test-Path $script:DefaultNode) { $script:DefaultNode } else { "node" }
$script:CardItems = @()
$script:VisibleCardItems = @()
$script:CandidateItems = @()
$script:SelectedCard = $null
$script:CurrentCard = $null
$script:SelectedFindingEntry = $null
$script:SelectedRawFindingEntry = $null
$script:SelectedDictionaryFile = $null
$script:SelectedDictionaryData = $null
$script:SelectedConceptId = ""
$script:LogBox = $null
$script:BusyButtons = @()

function Join-Root([string]$Path) {
  return Join-Path $script:Root $Path
}

function Read-Text([string]$Path) {
  if (!(Test-Path $Path)) { return "" }
  return [System.IO.File]::ReadAllText($Path, [System.Text.Encoding]::UTF8)
}

function Write-Text([string]$Path, [string]$Text) {
  $encoding = New-Object System.Text.UTF8Encoding($false)
  [System.IO.Directory]::CreateDirectory([System.IO.Path]::GetDirectoryName($Path)) | Out-Null
  [System.IO.File]::WriteAllText($Path, $Text, $encoding)
}

function Read-JsonFile([string]$Path) {
  if (!(Test-Path $Path)) { return $null }
  try {
    return Read-Text $Path | ConvertFrom-Json
  } catch {
    Write-Log "Invalid JSON in $Path : $($_.Exception.Message)"
    return $null
  }
}

function Write-Log([string]$Message) {
  $timestamp = Get-Date -Format "HH:mm:ss"
  $line = "[$timestamp] $Message"
  if ($script:LogBox -and !$script:LogBox.IsDisposed) {
    $script:LogBox.AppendText("$line`r`n")
    $script:LogBox.SelectionStart = $script:LogBox.Text.Length
    $script:LogBox.ScrollToCaret()
    [System.Windows.Forms.Application]::DoEvents()
  } else {
    Write-Output $line
  }
}

function Quote-ProcessArg([string]$Value) {
  if ($null -eq $Value) { return '""' }
  $escaped = $Value.Replace('\', '\\').Replace('"', '\"')
  return '"' + $escaped + '"'
}

function Quote-CmdArg([string]$Value) {
  if ($null -eq $Value) { return '""' }
  return '"' + $Value.Replace('"', '""') + '"'
}

function Invoke-NodeScript([string]$ScriptPath, [string[]]$ScriptArgs = @()) {
  $stdoutPath = Join-Path ([System.IO.Path]::GetTempPath()) ("mobile-pack-pc-admin-{0}.out.log" -f ([System.Guid]::NewGuid().ToString("N")))
  $stderrPath = Join-Path ([System.IO.Path]::GetTempPath()) ("mobile-pack-pc-admin-{0}.err.log" -f ([System.Guid]::NewGuid().ToString("N")))
  $psi = New-Object System.Diagnostics.ProcessStartInfo
  $psi.FileName = $env:ComSpec
  $psi.WorkingDirectory = $script:Root
  $psi.UseShellExecute = $false
  $allArgs = @((Join-Root $ScriptPath)) + @($ScriptArgs | ForEach-Object { [string]$_ })
  $nodeCommand = (@($script:Node) + $allArgs | ForEach-Object { Quote-CmdArg $_ }) -join " "
  $command = "$nodeCommand > $(Quote-CmdArg $stdoutPath) 2> $(Quote-CmdArg $stderrPath)"
  $psi.Arguments = "/d /s /c " + (Quote-CmdArg $command)

  Write-Log "RUN node $ScriptPath $($ScriptArgs -join ' ')"
  $process = New-Object System.Diagnostics.Process
  $process.StartInfo = $psi
  [void]$process.Start()
  while (!$process.WaitForExit(200)) {
    [System.Windows.Forms.Application]::DoEvents()
  }
  $process.WaitForExit()
  $stdoutText = Read-Text $stdoutPath
  $stderrText = Read-Text $stderrPath
  if ($stdoutText.Trim()) {
    foreach ($line in ($stdoutText -split "`r?`n")) {
      if ($line.Trim()) { Write-Log $line }
    }
  }
  if ($stderrText.Trim()) {
    foreach ($line in ($stderrText -split "`r?`n")) {
      if ($line.Trim()) { Write-Log $line }
    }
  }
  if ($process.ExitCode -ne 0) {
    $detail = @()
    if ($stderrText) { $detail += $stderrText }
    if ($stdoutText) { $detail += $stdoutText }
    $message = "Command failed: $ScriptPath ($($process.ExitCode))"
    if ($detail.Count) { $message = "$message`r`n$($detail -join "`r`n")" }
    throw $message
  }
  Remove-Item -LiteralPath $stdoutPath -ErrorAction SilentlyContinue
  Remove-Item -LiteralPath $stderrPath -ErrorAction SilentlyContinue
}

function Invoke-GuiAction([scriptblock]$Action) {
  try {
    foreach ($button in $script:BusyButtons) {
      if ($button -and !$button.IsDisposed) { $button.Enabled = $false }
    }
    [System.Windows.Forms.Application]::DoEvents()
    & $Action
  } catch {
    Write-Log $_.Exception.Message
    [System.Windows.Forms.MessageBox]::Show($_.Exception.Message, "エラー")
  } finally {
    foreach ($button in $script:BusyButtons) {
      if ($button -and !$button.IsDisposed) { $button.Enabled = $true }
    }
    [System.Windows.Forms.Application]::DoEvents()
  }
}

function Json-Pretty([object]$Value) {
  return ($Value | ConvertTo-Json -Depth 80)
}

function Get-JsonSha256([object]$Value) {
  $json = $Value | ConvertTo-Json -Depth 100 -Compress
  $bytes = [System.Text.Encoding]::UTF8.GetBytes($json)
  $sha = [System.Security.Cryptography.SHA256]::Create()
  try {
    $hash = $sha.ComputeHash($bytes)
    return (($hash | ForEach-Object { $_.ToString("x2") }) -join "")
  } finally {
    $sha.Dispose()
  }
}

function Set-JsonProperty([object]$Object, [string]$Name, [object]$Value) {
  if ($Object.PSObject.Properties[$Name]) {
    $Object.$Name = $Value
  } else {
    $Object | Add-Member -NotePropertyName $Name -NotePropertyValue $Value
  }
}

function Set-CardFindingsReviewStatus([object]$Card, [string]$Status) {
  foreach ($group in @($Card.imaging.mri.findings_by_sequence)) {
    foreach ($finding in @($group.findings)) {
      Set-JsonProperty $finding "review_status" $Status
    }
  }
  foreach ($group in @($Card.imaging.ct.findings_by_phase)) {
    foreach ($finding in @($group.findings)) {
      Set-JsonProperty $finding "review_status" $Status
    }
  }
}

function Ensure-ObjectProperty([object]$Object, [string]$Name) {
  if (!$Object.PSObject.Properties[$Name] -or $null -eq $Object.$Name) {
    Set-JsonProperty $Object $Name ([pscustomobject]@{})
  }
  return $Object.$Name
}

function Get-StringValue([object]$Value) {
  if ($null -eq $Value) { return "" }
  return [string]$Value
}

function Set-TextBoxValue($TextBox, [object]$Value) {
  if ($TextBox -and !$TextBox.IsDisposed) { $TextBox.Text = Get-StringValue $Value }
}

function Set-CheckBoxValue($CheckBox, [object]$Value) {
  if (!$CheckBox -or $CheckBox.IsDisposed) { return }
  $CheckBox.Checked = [bool]$Value
}

function Get-IntOrNull([string]$Value) {
  $trimmed = $Value.Trim()
  if (!$trimmed) { return $null }
  $number = 0
  if ([int]::TryParse($trimmed, [ref]$number)) { return $number }
  throw "数値として読み込めません: $Value"
}

function Set-ComboValue($ComboBox, [string]$Value) {
  if (!$ComboBox -or $ComboBox.IsDisposed) { return }
  if ($Value -and $ComboBox.Items.Contains($Value)) {
    $ComboBox.SelectedItem = $Value
  } elseif ($ComboBox.Items.Count -gt 0) {
    $ComboBox.SelectedIndex = 0
  }
}

function Get-ComboValue($ComboBox) {
  if (!$ComboBox -or !$ComboBox.SelectedItem) { return "" }
  return [string]$ComboBox.SelectedItem
}

function Get-CardFindingEntries([object]$Card) {
  $entries = @()
  if (!$Card -or !$Card.imaging) { return $entries }
  foreach ($group in @($Card.imaging.ct.findings_by_phase)) {
    $code = [string]$group.phase.code
    foreach ($finding in @($group.findings)) {
      if ($finding) {
        $entries += [pscustomobject]@{
          Modality = "CT"
          Acquisition = $code
          Finding = $finding
        }
      }
    }
  }
  foreach ($group in @($Card.imaging.mri.findings_by_sequence)) {
    $code = [string]$group.sequence.code
    foreach ($finding in @($group.findings)) {
      if ($finding) {
        $entries += [pscustomobject]@{
          Modality = "MRI"
          Acquisition = $code
          Finding = $finding
        }
      }
    }
  }
  return $entries
}

function Set-FindingGridCellValue($Row, [int]$Index, [object]$Value) {
  if ($null -eq $Value) { $Row.Cells[$Index].Value = "" } else { $Row.Cells[$Index].Value = [string]$Value }
}

function Refresh-FindingGrid([object]$Card) {
  if (!$FindingGrid -or $FindingGrid.IsDisposed) { return }
  $FindingGrid.Rows.Clear()
  foreach ($entry in @(Get-CardFindingEntries $Card)) {
    $finding = $entry.Finding
    $rowIndex = $FindingGrid.Rows.Add()
    $row = $FindingGrid.Rows[$rowIndex]
    Set-FindingGridCellValue $row 0 $entry.Modality
    Set-FindingGridCellValue $row 1 $entry.Acquisition
    Set-FindingGridCellValue $row 2 $finding.finding_code
    Set-FindingGridCellValue $row 3 $finding.typicality
    Set-FindingGridCellValue $row 4 $finding.diagnostic_weight
    Set-FindingGridCellValue $row 5 $finding.review_status
    Set-FindingGridCellValue $row 6 $finding.finding_text
    $row.Tag = $entry
  }
  $script:SelectedFindingEntry = $null
  Clear-FindingForm
  $FindingCountLabel.Text = "所見数: $($FindingGrid.Rows.Count)"
}

function Clear-FindingForm {
  $script:SelectedFindingEntry = $null
  foreach ($box in @(
    $FindingIdBox,
    $FindingCodeBox,
    $FindingAcquisitionBox,
    $FindingTargetBox,
    $FindingWeightBox,
    $FindingKeywordsBox,
    $FindingTextBox
  )) {
    if ($box -and !$box.IsDisposed) { $box.Clear() }
  }
  if ($FindingModalityCombo -and $FindingModalityCombo.Items.Count -gt 0) { $FindingModalityCombo.SelectedIndex = 0 }
  if ($FindingTypicalityCombo -and $FindingTypicalityCombo.Items.Count -gt 0) { $FindingTypicalityCombo.SelectedIndex = 0 }
  if ($FindingReviewStatusCombo -and $FindingReviewStatusCombo.Items.Count -gt 0) { $FindingReviewStatusCombo.SelectedIndex = 0 }
  Set-CheckBoxValue $FindingNegativeCheck $false
}

function Show-SelectedFinding {
  if (!$FindingGrid -or $FindingGrid.SelectedRows.Count -eq 0) {
    Clear-FindingForm
    return
  }
  $entry = $FindingGrid.SelectedRows[0].Tag
  if (!$entry -or !$entry.Finding) {
    Clear-FindingForm
    return
  }
  $script:SelectedFindingEntry = $entry
  $finding = $entry.Finding
  Set-TextBoxValue $FindingIdBox $finding.finding_id
  Set-ComboValue $FindingModalityCombo ([string]$finding.modality)
  Set-TextBoxValue $FindingAcquisitionBox $finding.acquisition.code
  Set-TextBoxValue $FindingCodeBox $finding.finding_code
  Set-TextBoxValue $FindingTargetBox $finding.target
  Set-ComboValue $FindingTypicalityCombo ([string]$finding.typicality)
  Set-TextBoxValue $FindingWeightBox $finding.diagnostic_weight
  Set-ComboValue $FindingReviewStatusCombo ([string]$finding.review_status)
  Set-TextBoxValue $FindingKeywordsBox (($finding.keywords | ForEach-Object { [string]$_ }) -join ", ")
  Set-TextBoxValue $FindingTextBox $finding.finding_text
  Set-CheckBoxValue $FindingNegativeCheck ($finding.modifiers -and $finding.modifiers.polarity -eq "absent")
}

function Apply-FindingForm {
  if (!$script:SelectedFindingEntry -or !$script:SelectedFindingEntry.Finding) { return }
  $finding = $script:SelectedFindingEntry.Finding
  Set-JsonProperty $finding "modality" (Get-ComboValue $FindingModalityCombo)
  $acquisition = Ensure-ObjectProperty $finding "acquisition"
  $acquisitionType = if ((Get-ComboValue $FindingModalityCombo) -eq "CT") { "phase" } else { "sequence" }
  Set-JsonProperty $acquisition "type" $acquisitionType
  Set-JsonProperty $acquisition "code" $FindingAcquisitionBox.Text.Trim()
  Set-JsonProperty $finding "finding_code" $FindingCodeBox.Text.Trim()
  Set-JsonProperty $finding "target" $FindingTargetBox.Text.Trim()
  Set-JsonProperty $finding "typicality" (Get-ComboValue $FindingTypicalityCombo)
  Set-JsonProperty $finding "diagnostic_weight" (Get-IntOrNull $FindingWeightBox.Text)
  Set-JsonProperty $finding "review_status" (Get-ComboValue $FindingReviewStatusCombo)
  Set-JsonProperty $finding "keywords" @($FindingKeywordsBox.Text -split "," | ForEach-Object { $_.Trim() } | Where-Object { $_ })
  Set-JsonProperty $finding "finding_text" $FindingTextBox.Text.Trim()
  $modifiers = Ensure-ObjectProperty $finding "modifiers"
  if ($FindingNegativeCheck.Checked) {
    Set-JsonProperty $modifiers "polarity" "absent"
  } elseif ($modifiers.PSObject.Properties["polarity"] -and $modifiers.polarity -eq "absent") {
    $modifiers.PSObject.Properties.Remove("polarity")
  }
  if ($script:CurrentCard) { Refresh-FindingGrid $script:CurrentCard }
}

function Get-CardRawFindingEntries([object]$Card) {
  $entries = @()
  if (!$Card -or !$Card.PSObject.Properties["raw_findings"] -or $null -eq $Card.raw_findings) { return $entries }
  $index = 0
  foreach ($rawFinding in @($Card.raw_findings)) {
    if ($rawFinding) {
      $entries += [pscustomobject]@{
        Index = $index
        RawFinding = $rawFinding
      }
    }
    $index += 1
  }
  return $entries
}

function Get-RawMappingStatus([object]$RawFinding) {
  if ($RawFinding -and $RawFinding.mapping -and $RawFinding.mapping.status) { return [string]$RawFinding.mapping.status }
  if ($RawFinding -and $RawFinding.review_status) { return [string]$RawFinding.review_status }
  return ""
}

function Refresh-RawFindingGrid([object]$Card) {
  if (!$RawFindingGrid -or $RawFindingGrid.IsDisposed) { return }
  $RawFindingGrid.Rows.Clear()
  foreach ($entry in @(Get-CardRawFindingEntries $Card)) {
    $rawFinding = $entry.RawFinding
    $rowIndex = $RawFindingGrid.Rows.Add()
    $row = $RawFindingGrid.Rows[$rowIndex]
    Set-FindingGridCellValue $row 0 $rawFinding.raw_finding_id
    Set-FindingGridCellValue $row 1 $rawFinding.modality_text
    Set-FindingGridCellValue $row 2 $rawFinding.acquisition_text
    Set-FindingGridCellValue $row 3 (Get-RawMappingStatus $rawFinding)
    Set-FindingGridCellValue $row 4 $rawFinding.finding_text
    $row.Tag = $entry
  }
  $script:SelectedRawFindingEntry = $null
  Clear-RawFindingForm
  $RawFindingCountLabel.Text = "自由記載: $($RawFindingGrid.Rows.Count)"
}

function Clear-RawFindingForm {
  $script:SelectedRawFindingEntry = $null
  foreach ($box in @(
    $RawFindingIdBox,
    $RawModalityBox,
    $RawAcquisitionBox,
    $RawAnatomyBox,
    $RawTargetBox,
    $RawCandidateCodeBox,
    $RawCandidateAcquisitionBox,
    $RawCandidateTargetBox,
    $RawFindingTextBox,
    $RawInterpretationBox,
    $RawMappingNotesBox
  )) {
    if ($box -and !$box.IsDisposed) { $box.Clear() }
  }
  if ($RawMappingStatusCombo -and $RawMappingStatusCombo.Items.Count -gt 0) { $RawMappingStatusCombo.SelectedIndex = 0 }
  if ($RawReviewStatusCombo -and $RawReviewStatusCombo.Items.Count -gt 0) { $RawReviewStatusCombo.SelectedIndex = 0 }
}

function Show-SelectedRawFinding {
  if (!$RawFindingGrid -or $RawFindingGrid.SelectedRows.Count -eq 0) {
    Clear-RawFindingForm
    return
  }
  $entry = $RawFindingGrid.SelectedRows[0].Tag
  if (!$entry -or !$entry.RawFinding) {
    Clear-RawFindingForm
    return
  }
  $script:SelectedRawFindingEntry = $entry
  $rawFinding = $entry.RawFinding
  Set-TextBoxValue $RawFindingIdBox $rawFinding.raw_finding_id
  Set-TextBoxValue $RawModalityBox $rawFinding.modality_text
  Set-TextBoxValue $RawAcquisitionBox $rawFinding.acquisition_text
  Set-TextBoxValue $RawAnatomyBox $rawFinding.anatomy_text
  Set-TextBoxValue $RawTargetBox $rawFinding.target_text
  Set-TextBoxValue $RawFindingTextBox $rawFinding.finding_text
  Set-TextBoxValue $RawInterpretationBox $rawFinding.interpretation
  Set-ComboValue $RawReviewStatusCombo ([string]$rawFinding.review_status)
  $mapping = Ensure-ObjectProperty $rawFinding "mapping"
  Set-ComboValue $RawMappingStatusCombo ([string]$mapping.status)
  Set-TextBoxValue $RawCandidateCodeBox $mapping.candidate_finding_code
  Set-TextBoxValue $RawCandidateAcquisitionBox $mapping.candidate_acquisition_code
  Set-TextBoxValue $RawCandidateTargetBox $mapping.candidate_target
  Set-TextBoxValue $RawMappingNotesBox $mapping.notes
}

function Apply-RawFindingForm {
  if (!$script:SelectedRawFindingEntry -or !$script:SelectedRawFindingEntry.RawFinding) { return }
  $rawFinding = $script:SelectedRawFindingEntry.RawFinding
  Set-JsonProperty $rawFinding "modality_text" $RawModalityBox.Text.Trim()
  Set-JsonProperty $rawFinding "acquisition_text" $RawAcquisitionBox.Text.Trim()
  Set-JsonProperty $rawFinding "anatomy_text" $RawAnatomyBox.Text.Trim()
  Set-JsonProperty $rawFinding "target_text" $RawTargetBox.Text.Trim()
  Set-JsonProperty $rawFinding "finding_text" $RawFindingTextBox.Text.Trim()
  Set-JsonProperty $rawFinding "interpretation" $RawInterpretationBox.Text.Trim()
  Set-JsonProperty $rawFinding "review_status" (Get-ComboValue $RawReviewStatusCombo)
  $mapping = Ensure-ObjectProperty $rawFinding "mapping"
  Set-JsonProperty $mapping "status" (Get-ComboValue $RawMappingStatusCombo)
  Set-JsonProperty $mapping "candidate_finding_code" $RawCandidateCodeBox.Text.Trim()
  Set-JsonProperty $mapping "candidate_acquisition_code" $RawCandidateAcquisitionBox.Text.Trim()
  Set-JsonProperty $mapping "candidate_target" $RawCandidateTargetBox.Text.Trim()
  Set-JsonProperty $mapping "notes" $RawMappingNotesBox.Text.Trim()
  if ($script:CurrentCard) { Refresh-RawFindingGrid $script:CurrentCard }
}

function Populate-CardForm([object]$Card) {
  if (!$Card) { return }
  Set-TextBoxValue $CardDiseaseIdBox $Card.disease_id
  Set-TextBoxValue $CardNameJaBox $Card.disease_name.ja
  Set-TextBoxValue $CardNameEnBox $Card.disease_name.en
  Set-ComboValue $CardFrequencyLabelCombo ([string]$Card.frequency.label)
  Set-TextBoxValue $CardPrevalenceRankBox $Card.frequency.prevalence_rank
  Set-TextBoxValue $CardFrequencySummaryBox $Card.frequency.summary
  Set-ComboValue $CardSexPredilectionCombo ([string]$Card.demographics.sex.predilection)
  Set-TextBoxValue $CardSexSummaryBox $Card.demographics.sex.summary
  Set-TextBoxValue $CardAgeMinBox $Card.demographics.age.typical_min
  Set-TextBoxValue $CardAgeMaxBox $Card.demographics.age.typical_max
  Set-TextBoxValue $CardPeakAgeBox $Card.demographics.age.peak_decade
  Set-TextBoxValue $CardAgeSummaryBox $Card.demographics.age.summary
  Set-TextBoxValue $CardOverviewBox $Card.clinical.overview
  Set-TextBoxValue $CardTreatmentBox $Card.clinical.treatment
  Set-TextBoxValue $CardEpidemiologyBox $Card.clinical.epidemiology
  Set-TextBoxValue $CardKeywordsBox (($Card.keywords | ForEach-Object { [string]$_ }) -join ", ")
  Set-TextBoxValue $CardEvidenceSummaryBox $Card.evidence.summary
  Set-TextBoxValue $CardReviewNotesBox $Card.review.notes
  Refresh-FindingGrid $Card
  Refresh-RawFindingGrid $Card
}

function Clear-CardForm {
  foreach ($box in @(
    $CardDiseaseIdBox,
    $CardNameJaBox,
    $CardNameEnBox,
    $CardPrevalenceRankBox,
    $CardFrequencySummaryBox,
    $CardSexSummaryBox,
    $CardAgeMinBox,
    $CardAgeMaxBox,
    $CardPeakAgeBox,
    $CardAgeSummaryBox,
    $CardOverviewBox,
    $CardTreatmentBox,
    $CardEpidemiologyBox,
    $CardKeywordsBox,
    $CardEvidenceSummaryBox,
    $CardReviewNotesBox
  )) {
    if ($box -and !$box.IsDisposed) { $box.Clear() }
  }
  if ($CardFrequencyLabelCombo -and $CardFrequencyLabelCombo.Items.Count -gt 0) { $CardFrequencyLabelCombo.SelectedIndex = 0 }
  if ($CardSexPredilectionCombo -and $CardSexPredilectionCombo.Items.Count -gt 0) { $CardSexPredilectionCombo.SelectedIndex = 0 }
  if ($FindingGrid -and !$FindingGrid.IsDisposed) { $FindingGrid.Rows.Clear() }
  if ($RawFindingGrid -and !$RawFindingGrid.IsDisposed) { $RawFindingGrid.Rows.Clear() }
  Clear-FindingForm
  Clear-RawFindingForm
}

function Update-CardFromForm([object]$Card) {
  if (!$Card) { throw "疾患カードが読み込まれていません。" }
  Apply-FindingForm
  Apply-RawFindingForm
  $name = Ensure-ObjectProperty $Card "disease_name"
  Set-JsonProperty $name "ja" $CardNameJaBox.Text.Trim()
  Set-JsonProperty $name "en" $CardNameEnBox.Text.Trim()

  $frequency = Ensure-ObjectProperty $Card "frequency"
  Set-JsonProperty $frequency "label" (Get-ComboValue $CardFrequencyLabelCombo)
  Set-JsonProperty $frequency "prevalence_rank" (Get-IntOrNull $CardPrevalenceRankBox.Text)
  Set-JsonProperty $frequency "summary" $CardFrequencySummaryBox.Text.Trim()

  $clinical = Ensure-ObjectProperty $Card "clinical"
  Set-JsonProperty $clinical "overview" $CardOverviewBox.Text.Trim()
  Set-JsonProperty $clinical "treatment" $CardTreatmentBox.Text.Trim()
  Set-JsonProperty $clinical "epidemiology" $CardEpidemiologyBox.Text.Trim()

  $demographics = Ensure-ObjectProperty $Card "demographics"
  $sex = Ensure-ObjectProperty $demographics "sex"
  Set-JsonProperty $sex "predilection" (Get-ComboValue $CardSexPredilectionCombo)
  Set-JsonProperty $sex "summary" $CardSexSummaryBox.Text.Trim()
  $age = Ensure-ObjectProperty $demographics "age"
  Set-JsonProperty $age "typical_min" (Get-IntOrNull $CardAgeMinBox.Text)
  Set-JsonProperty $age "typical_max" (Get-IntOrNull $CardAgeMaxBox.Text)
  Set-JsonProperty $age "peak_decade" $CardPeakAgeBox.Text.Trim()
  Set-JsonProperty $age "summary" $CardAgeSummaryBox.Text.Trim()

  $keywords = @($CardKeywordsBox.Text -split "," | ForEach-Object { $_.Trim() } | Where-Object { $_ })
  Set-JsonProperty $Card "keywords" $keywords

  $evidence = Ensure-ObjectProperty $Card "evidence"
  Set-JsonProperty $evidence "summary" $CardEvidenceSummaryBox.Text.Trim()
  $review = Ensure-ObjectProperty $Card "review"
  Set-JsonProperty $review "notes" $CardReviewNotesBox.Text.Trim()
  Set-JsonProperty $Card "updated_at" ((Get-Date).ToUniversalTime().ToString("yyyy-MM-ddTHH:mm:ss.fffZ"))
  Set-JsonProperty $Card "content_hash" ""
  Set-JsonProperty $Card "content_hash" (Get-JsonSha256 $Card)
  return $Card
}

function Set-CardRawVisible([bool]$Visible) {
  $CardFormPanel.Visible = !$Visible
  $CardEditor.Visible = $Visible
  $CardRawToggleButton.Text = if ($Visible) { "フォーム編集に戻る" } else { "JSON原文を開く" }
}

function Set-DictionaryRawVisible([bool]$Visible) {
  $DictionaryRawPanel.Visible = $Visible
  if ($Visible) {
    $DictionaryRawPanel.BringToFront()
    [void]$DictionaryFileEditor.Focus()
  } else {
    if ($ConceptEditorPanel.Visible) {
      $ConceptEditorPanel.BringToFront()
    } else {
      $DictionaryFriendlyMessage.BringToFront()
    }
  }
  $DictionaryRawToggleButton.Text = if ($Visible) { "JSON原文を閉じる" } else { "JSON原文を開く" }
}

function Update-Status {
  $draftCount = @($script:CardItems | Where-Object { $_.Source -eq "draft" }).Count
  $approvedCount = @($script:CardItems | Where-Object { $_.Source -eq "approved" }).Count
  $pendingCount = @($script:CandidateItems | Where-Object { $_.status -eq "pending" }).Count
  $StatusLabel.Text = "下書き $draftCount 件 / 承認済み $approvedCount 件 / 辞書候補 $pendingCount 件"
}

function Load-Cards {
  $script:CardItems = @()
  foreach ($entry in @(
    @{ Source = "draft"; Dir = "data\drafts" },
    @{ Source = "approved"; Dir = "data\diseases" }
  )) {
    $dir = Join-Root $entry.Dir
    if (!(Test-Path $dir)) { continue }
    Get-ChildItem -LiteralPath $dir -Filter *.json | Sort-Object Name | ForEach-Object {
      $card = Read-JsonFile $_.FullName
      $diseaseId = if ($card -and $card.disease_id) { [string]$card.disease_id } else { [string]$_.BaseName }
      if (!$diseaseId.Trim()) { $diseaseId = [string]$_.BaseName }
      $nameJa = if ($card -and $card.disease_name) { $card.disease_name.ja } else { "" }
      $nameEn = if ($card -and $card.disease_name) { $card.disease_name.en } else { "" }
      $sourceLabel = if ($entry.Source -eq "draft") { "下書き" } else { "承認済み" }
      $display = "[$sourceLabel] $diseaseId"
      if ($nameJa -or $nameEn) { $display = "$display - $nameJa $nameEn" }
      $script:CardItems += [pscustomobject]@{
        Source = $entry.Source
        DiseaseId = $diseaseId
        FilePath = $_.FullName
        Display = $display
      }
    }
  }
}

function Refresh-CardList {
  $selectedDiseaseId = ""
  $selectedSource = ""
  $selectedCard = Get-SelectedCard
  if ($selectedCard) {
    $selectedDiseaseId = [string]$selectedCard.DiseaseId
    $selectedSource = [string]$selectedCard.Source
  }
  $CardList.Items.Clear()
  $script:VisibleCardItems = @()
  $filter = $CardFilterBox.Text.Trim().ToLowerInvariant()
  $mode = if ($ShowDraftOnlyCheck.Checked) { "draft" } else { "all" }
  $script:VisibleCardItems = @($script:CardItems | Where-Object {
    (($mode -eq "all") -or ($_.Source -eq "draft")) -and
    (!$filter -or $_.Display.ToLowerInvariant().Contains($filter) -or $_.DiseaseId.ToLowerInvariant().Contains($filter))
  })
  foreach ($item in $script:VisibleCardItems) {
    [void]$CardList.Items.Add($item.Display)
  }
  if ($selectedDiseaseId) {
    for ($i = 0; $i -lt $script:VisibleCardItems.Count; $i++) {
      if ($script:VisibleCardItems[$i].DiseaseId -eq $selectedDiseaseId -and $script:VisibleCardItems[$i].Source -eq $selectedSource) {
        $CardList.SelectedIndex = $i
        break
      }
    }
  }
}

function Get-SelectedCard {
  if ($CardList.SelectedIndex -lt 0) {
    if ($script:SelectedCard -and $script:SelectedCard.DiseaseId -and (Test-Path $script:SelectedCard.FilePath)) {
      return $script:SelectedCard
    }
    return $null
  }
  if ($CardList.SelectedIndex -ge $script:VisibleCardItems.Count) {
    if ($script:SelectedCard -and $script:SelectedCard.DiseaseId -and (Test-Path $script:SelectedCard.FilePath)) {
      return $script:SelectedCard
    }
    return $null
  }
  $card = $script:VisibleCardItems[$CardList.SelectedIndex]
  if (!$card -or !$card.DiseaseId) { return $null }
  if (!(Test-Path $card.FilePath)) {
    $dir = if ($card.Source -eq "approved") { "data\diseases" } else { "data\drafts" }
    $filePath = Join-Root "$dir\$($card.DiseaseId).json"
    if (Test-Path $filePath) { $card.FilePath = $filePath }
  }
  return $card
}

function Show-SelectedCard {
  $script:SelectedCard = Get-SelectedCard
  if (!$script:SelectedCard) { return }
  $text = Read-Text $script:SelectedCard.FilePath
  $CardEditor.Text = $text
  $card = $text | ConvertFrom-Json
  $script:CurrentCard = $card
  Populate-CardForm $card
  $sourceLabel = if ($script:SelectedCard.Source -eq "draft") { "下書き" } else { "承認済み" }
  $CardPathLabel.Text = "${sourceLabel}: $($script:SelectedCard.FilePath)"
}

function Save-SelectedCard {
  if (!$script:SelectedCard) {
    [System.Windows.Forms.MessageBox]::Show("先に疾患カードを選択してください。")
    return
  }
  if ($CardEditor.Visible) {
    try {
      $card = $CardEditor.Text | ConvertFrom-Json
    } catch {
      [System.Windows.Forms.MessageBox]::Show("JSONとして読み込めません: $($_.Exception.Message)")
      return
    }
    Write-Text $script:SelectedCard.FilePath (Json-Pretty $card)
    $script:CurrentCard = $card
    Populate-CardForm $card
  } else {
    try {
      $card = if ($script:CurrentCard) { $script:CurrentCard } else { Read-Text $script:SelectedCard.FilePath | ConvertFrom-Json }
      $card = Update-CardFromForm $card
    } catch {
      [System.Windows.Forms.MessageBox]::Show("フォームの内容を保存できません: $($_.Exception.Message)")
      return
    }
    $json = Json-Pretty $card
    Write-Text $script:SelectedCard.FilePath $json
    $script:CurrentCard = $card
    $CardEditor.Text = $json
  }
  Write-Log "疾患カードを保存しました: $($script:SelectedCard.DiseaseId)"
  Load-Cards
  Refresh-CardList
  Update-Status
  return $true
}

function Delete-SelectedCard {
  $card = Get-SelectedCard
  if (!$card) {
    [System.Windows.Forms.MessageBox]::Show("削除する疾患カードを選択してください。")
    return
  }
  if (!$card.FilePath -or !(Test-Path $card.FilePath)) {
    [System.Windows.Forms.MessageBox]::Show("選択した疾患カードのファイルが見つかりません。再読み込みしてからもう一度試してください。")
    return
  }
  $sourceLabel = if ($card.Source -eq "draft") { "下書き" } else { "承認済み" }
  $message = @(
    "この疾患カードを一覧から削除します。",
    "",
    "種類: $sourceLabel",
    "疾患ID: $($card.DiseaseId)",
    "ファイル: $($card.FilePath)",
    "",
    "ファイルは data\trash\cards に退避します。続行しますか？"
  ) -join "`r`n"
  $answer = [System.Windows.Forms.MessageBox]::Show($message, "削除の確認", "YesNo", "Warning")
  if ($answer -ne "Yes") { return }

  $confirm = [Microsoft.VisualBasic.Interaction]::InputBox(
    "誤削除防止のため、疾患IDを入力してください。`r`n$($card.DiseaseId)",
    "疾患IDの確認",
    ""
  )
  if ($confirm.Trim() -ne [string]$card.DiseaseId) {
    [System.Windows.Forms.MessageBox]::Show("疾患IDが一致しないため、削除を中止しました。")
    return
  }

  $trashSource = if ($card.Source -eq "draft") { "drafts" } else { "approved" }
  $trashDir = Join-Root "data\trash\cards\$trashSource"
  [System.IO.Directory]::CreateDirectory($trashDir) | Out-Null
  $timestamp = Get-Date -Format "yyyyMMdd-HHmmss"
  $trashPath = Join-Path $trashDir ("{0}__{1}" -f $timestamp, [System.IO.Path]::GetFileName($card.FilePath))
  if (Test-Path $trashPath) {
    $trashPath = Join-Path $trashDir ("{0}__{1}__{2}" -f $timestamp, [System.Guid]::NewGuid().ToString("N"), [System.IO.Path]::GetFileName($card.FilePath))
  }
  Move-Item -LiteralPath $card.FilePath -Destination $trashPath
  Write-Log "疾患カードを退避しました: [$sourceLabel] $($card.DiseaseId) -> $trashPath"
  $script:SelectedCard = $null
  $CardEditor.Clear()
  Clear-CardForm
  $CardPathLabel.Text = "左の一覧から疾患カードを選択してください。"
  Load-Cards
  Refresh-CardList
  Update-Status
}

function Approve-SelectedDraft {
  $card = Get-SelectedCard
  if (!$card -or $card.Source -ne "draft") {
    [System.Windows.Forms.MessageBox]::Show("承認する下書きカードを選択してください。")
    return
  }
  if (!$card.FilePath -or !(Test-Path $card.FilePath)) {
    [System.Windows.Forms.MessageBox]::Show("選択した下書きファイルが見つかりません。再読み込みしてからもう一度試してください。")
    Write-Log "Approve aborted: draft path missing. Display=$($CardList.SelectedItem)"
    return
  }
  $draftPath = [string]$card.FilePath
  $fileDiseaseId = [System.IO.Path]::GetFileNameWithoutExtension($draftPath)
  $diseaseId = [string]$card.DiseaseId
  if (!$diseaseId.Trim()) { $diseaseId = $fileDiseaseId }
  if (!$diseaseId.Trim()) {
    [System.Windows.Forms.MessageBox]::Show("選択した下書きに disease_id がなく、ファイル名からも判定できません。")
    Write-Log "Approve aborted: empty disease_id and file name. Path=$draftPath"
    return
  }
  if ($diseaseId -ne $fileDiseaseId) {
    [System.Windows.Forms.MessageBox]::Show("カード内の disease_id とファイル名が一致しません。`r`nカード: $diseaseId`r`nファイル: $fileDiseaseId")
    Write-Log "Approve aborted: disease_id mismatch. Card=$diseaseId File=$fileDiseaseId Path=$draftPath"
    return
  }
  if ($script:SelectedCard -and $script:SelectedCard.DiseaseId -eq $card.DiseaseId) {
    $currentText = Read-Text $card.FilePath
    $shouldAskSave = $false
    if ($CardEditor.Visible -and $CardEditor.Text -ne $currentText) { $shouldAskSave = $true }
    if (!$CardEditor.Visible) { $shouldAskSave = $true }
    if ($shouldAskSave) {
      $saveAnswer = [System.Windows.Forms.MessageBox]::Show("現在の編集内容を保存してから承認しますか？", "承認前の保存確認", "YesNoCancel")
      if ($saveAnswer -eq "Cancel") { return }
      if ($saveAnswer -eq "Yes") {
        $saved = Save-SelectedCard
        if (!$saved) { return }
        Load-Cards
        $card = $script:CardItems | Where-Object { $_.Source -eq "draft" -and $_.DiseaseId -eq $diseaseId } | Select-Object -First 1
        if (!$card) { [System.Windows.Forms.MessageBox]::Show("保存後に下書きを再取得できませんでした。再読み込みしてからもう一度試してください。"); return }
        $draftPath = [string]$card.FilePath
      }
    }
  }
  $answer = [System.Windows.Forms.MessageBox]::Show("この下書きを承認済みにしますか？`r`n$diseaseId", "承認の確認", "YesNo")
  if ($answer -ne "Yes") { return }
  $approvedPath = Join-Root "data\diseases\$diseaseId.json"
  if (Test-Path $approvedPath) {
    [System.Windows.Forms.MessageBox]::Show("同じIDの承認済みカードが既に存在します。`r`n$approvedPath`r`n手動で整理してから承認してください。")
    Write-Log "Approve aborted: approved card already exists. Path=$approvedPath"
    return
  }
  try {
    $draft = Read-Text $draftPath | ConvertFrom-Json
  } catch {
    [System.Windows.Forms.MessageBox]::Show("下書きJSONを読み込めません: $($_.Exception.Message)")
    return
  }
  if ([string]$draft.disease_id -ne $diseaseId) {
    [System.Windows.Forms.MessageBox]::Show("下書きJSON内の disease_id とファイル名が一致しません。`r`nJSON: $($draft.disease_id)`r`nファイル: $diseaseId")
    Write-Log "Approve aborted: JSON/file disease_id mismatch. JSON=$($draft.disease_id) File=$diseaseId"
    return
  }
  if (!$draft.review) {
    Set-JsonProperty $draft "review" ([pscustomobject]@{})
  }
  Set-JsonProperty $draft.review "status" "approved"
  Set-JsonProperty $draft.review "reviewed_at" ((Get-Date).ToUniversalTime().ToString("yyyy-MM-ddTHH:mm:ss.fffZ"))
  Set-CardFindingsReviewStatus $draft "approved"
  Set-JsonProperty $draft "updated_at" ((Get-Date).ToUniversalTime().ToString("yyyy-MM-ddTHH:mm:ss.fffZ"))
  Set-JsonProperty $draft "content_hash" ""
  Set-JsonProperty $draft "content_hash" (Get-JsonSha256 $draft)
  Write-Text $approvedPath (Json-Pretty $draft)
  Remove-Item -LiteralPath $draftPath
  Write-Log "下書きを承認しました: $diseaseId"
  Invoke-NodeScript "scripts\dictionary-maintenance.js"
  Refresh-All
}

function Load-Candidates {
  $script:CandidateItems = @()
  $path = Join-Root "data\dictionaries\new-concept-candidates.json"
  $data = Read-JsonFile $path
  if ($data -and $data.candidates) {
    $script:CandidateItems = @($data.candidates)
  }
}

function Refresh-CandidateList {
  if (!$CandidateList) { return }
  $CandidateList.Items.Clear()
  foreach ($item in ($script:CandidateItems | Where-Object { $_.status -eq "pending" })) {
    [void]$CandidateList.Items.Add("$($item.candidate_id) -> $($item.proposed_concept_id)")
  }
}

function Get-SelectedCandidateId {
  if (!$CandidateList) { return "" }
  if (!$CandidateList.SelectedItem) { return "" }
  return ($CandidateList.SelectedItem.ToString() -split " -> ")[0]
}

function Split-ListText([string]$Text) {
  return @($Text -split "`r?`n|," | ForEach-Object { $_.Trim() } | Where-Object { $_ })
}

function Show-SelectedCandidate {
  $id = Get-SelectedCandidateId
  if (!$id) { return }
  $candidate = $script:CandidateItems | Where-Object { $_.candidate_id -eq $id } | Select-Object -First 1
  if (!$candidate) { return }
  $CandidateEditor.Text = Json-Pretty $candidate
}

function Load-MaintenanceReport {
  if (!$ReportBox) { return }
  $reportPath = Join-Root "data\dictionaries\dictionary-maintenance-report.json"
  if (Test-Path $reportPath) {
    $ReportBox.Text = Read-Text $reportPath
  } else {
    $ReportBox.Text = "まだレポートがありません。上の「辞書候補・indexを更新」を実行してください。"
  }
}

function Run-Maintenance {
  Invoke-NodeScript "scripts\dictionary-maintenance.js"
  Refresh-All
}

function Run-BuildIndex {
  Invoke-NodeScript "scripts\build-index.js"
  Load-MaintenanceReport
}

function Refresh-DictionaryFiles {
  $selected = if ($DictionaryFileCombo.SelectedItem) { $DictionaryFileCombo.SelectedItem.ToString() } else { "" }
  $DictionaryFileCombo.Items.Clear()
  $dictDir = Join-Root "data\dictionaries"
  Get-ChildItem -LiteralPath $dictDir -Filter *.json | Sort-Object Name | ForEach-Object {
    [void]$DictionaryFileCombo.Items.Add($_.Name)
  }
  if ($selected -and $DictionaryFileCombo.Items.Contains($selected)) {
    $DictionaryFileCombo.SelectedItem = $selected
  } elseif ($DictionaryFileCombo.Items.Count -gt 0 -and !$DictionaryFileCombo.SelectedItem) {
    $DictionaryFileCombo.SelectedIndex = 0
  }
}

function Load-SelectedDictionaryFile {
  if (!$DictionaryFileCombo.SelectedItem) { return }
  $script:SelectedDictionaryFile = Join-Root "data\dictionaries\$($DictionaryFileCombo.SelectedItem)"
  $text = Read-Text $script:SelectedDictionaryFile
  $DictionaryFileEditor.Text = $text
  try {
    $script:SelectedDictionaryData = $text | ConvertFrom-Json
  } catch {
    $script:SelectedDictionaryData = $null
  }
  Refresh-ConceptEditor
}

function Save-SelectedDictionaryFile {
  if (!$script:SelectedDictionaryFile) {
    [System.Windows.Forms.MessageBox]::Show("先に辞書ファイルを選択してください。")
    return
  }
  try {
    $null = $DictionaryFileEditor.Text | ConvertFrom-Json
  } catch {
    [System.Windows.Forms.MessageBox]::Show("JSONとして読み込めません: $($_.Exception.Message)")
    return
  }
  Write-Text $script:SelectedDictionaryFile $DictionaryFileEditor.Text
  Write-Log "辞書ファイルを保存しました: $script:SelectedDictionaryFile"
  Refresh-All
}

function Refresh-ConceptEditor {
  $ConceptList.Items.Clear()
  $script:SelectedConceptId = ""
  $ConceptEditorPanel.Visible = $false
  $DictionaryFriendlyMessage.Visible = $true
  $DictionaryFriendlyMessage.Text = "この辞書はフォーム編集に未対応です。必要な場合は「JSON原文を開く」から直接編集してください。"
  if (!$DictionaryFileCombo.SelectedItem -or $DictionaryFileCombo.SelectedItem.ToString() -ne "finding-concepts.json") { return }
  if (!$script:SelectedDictionaryData) { return }
  $DictionaryFriendlyMessage.Visible = $false
  $ConceptEditorPanel.Visible = $true
  Refresh-ConceptList
}

function Refresh-ConceptList {
  if (!$script:SelectedDictionaryData) { return }
  $selected = $script:SelectedConceptId
  $ConceptList.Items.Clear()
  $filter = $ConceptFilterBox.Text.Trim().ToLowerInvariant()
  foreach ($prop in ($script:SelectedDictionaryData.PSObject.Properties | Sort-Object Name)) {
    $concept = $prop.Value
    $labelJa = Get-StringValue $concept.canonical_label.ja
    $labelEn = Get-StringValue $concept.canonical_label.en
    $line = "$($prop.Name) | $labelJa | $labelEn"
    if (!$filter -or $line.ToLowerInvariant().Contains($filter)) {
      [void]$ConceptList.Items.Add($line)
    }
  }
  if ($selected) {
    for ($i = 0; $i -lt $ConceptList.Items.Count; $i++) {
      if ($ConceptList.Items[$i].ToString().StartsWith("$selected |")) {
        $ConceptList.SelectedIndex = $i
        break
      }
    }
  }
}

function Get-SelectedConceptId {
  if (!$ConceptList.SelectedItem) { return "" }
  return ($ConceptList.SelectedItem.ToString() -split " \| ")[0]
}

function Show-SelectedConcept {
  $id = Get-SelectedConceptId
  if (!$id -or !$script:SelectedDictionaryData) { return }
  $script:SelectedConceptId = $id
  $concept = $script:SelectedDictionaryData.PSObject.Properties[$id].Value
  if (!$concept) { return }
  Set-TextBoxValue $ConceptIdBox $id
  Set-TextBoxValue $ConceptLabelJaBox $concept.canonical_label.ja
  Set-TextBoxValue $ConceptLabelEnBox $concept.canonical_label.en
  Set-TextBoxValue $ConceptFeatureBox $concept.feature
  Set-TextBoxValue $ConceptModalitiesBox (($concept.allowed_modalities | ForEach-Object { [string]$_ }) -join ", ")
  Set-TextBoxValue $ConceptAcquisitionsBox (($concept.allowed_acquisitions | ForEach-Object { [string]$_ }) -join ", ")
  Set-TextBoxValue $ConceptSynonymsJaBox (($concept.synonyms.ja | ForEach-Object { [string]$_ }) -join "`r`n")
  Set-TextBoxValue $ConceptSynonymsEnBox (($concept.synonyms.en | ForEach-Object { [string]$_ }) -join "`r`n")
  Set-TextBoxValue $ConceptTokensBox (($concept.tokens | ForEach-Object { [string]$_ }) -join ", ")
  Set-TextBoxValue $ConceptOppositesBox (($concept.opposites | ForEach-Object { [string]$_ }) -join ", ")
}

function Save-SelectedConcept {
  if (!$script:SelectedDictionaryFile -or !$script:SelectedDictionaryData -or !$script:SelectedConceptId) {
    [System.Windows.Forms.MessageBox]::Show("先に finding-concepts.json の概念を選択してください。")
    return
  }
  $concept = $script:SelectedDictionaryData.PSObject.Properties[$script:SelectedConceptId].Value
  if (!$concept) { throw "選択中の概念が見つかりません: $script:SelectedConceptId" }
  $label = Ensure-ObjectProperty $concept "canonical_label"
  Set-JsonProperty $label "ja" $ConceptLabelJaBox.Text.Trim()
  Set-JsonProperty $label "en" $ConceptLabelEnBox.Text.Trim()
  Set-JsonProperty $concept "feature" $ConceptFeatureBox.Text.Trim()
  Set-JsonProperty $concept "allowed_modalities" (Split-ListText $ConceptModalitiesBox.Text)
  Set-JsonProperty $concept "allowed_acquisitions" (Split-ListText $ConceptAcquisitionsBox.Text)
  $synonyms = Ensure-ObjectProperty $concept "synonyms"
  Set-JsonProperty $synonyms "ja" (Split-ListText $ConceptSynonymsJaBox.Text)
  Set-JsonProperty $synonyms "en" (Split-ListText $ConceptSynonymsEnBox.Text)
  Set-JsonProperty $concept "tokens" (Split-ListText $ConceptTokensBox.Text)
  Set-JsonProperty $concept "opposites" (Split-ListText $ConceptOppositesBox.Text)
  $json = Json-Pretty $script:SelectedDictionaryData
  Write-Text $script:SelectedDictionaryFile $json
  $DictionaryFileEditor.Text = $json
  Write-Log "辞書概念を保存しました: $script:SelectedConceptId"
  Refresh-ConceptList
}

function Select-OneDriveFolder {
  $dialog = New-Object System.Windows.Forms.FolderBrowserDialog
  $dialog.Description = "iPhoneへ渡す JSON pack をコピーする OneDrive フォルダを選択してください"
  if ($OneDriveBox.Text -and (Test-Path $OneDriveBox.Text)) { $dialog.SelectedPath = $OneDriveBox.Text }
  if ($dialog.ShowDialog() -eq "OK") { $OneDriveBox.Text = $dialog.SelectedPath }
}

function Export-Mobile {
  Write-Log "iPhone用 JSON pack を作成しています。少し時間がかかることがあります。"
  Invoke-NodeScript "apps\pc-admin\pc-admin.js" @("export-mobile", $OneDriveBox.Text.Trim())
  $ExportResultLabel.Text = "完了: exports\mobile\radiology-ddx-pack.json を作成しました。OneDriveフォルダ指定時は同じファイルをコピー済みです。"
}

function Run-Doctor {
  Write-Log "全体点検を実行しています。"
  Invoke-NodeScript "scripts\doctor.js"
  $ExportResultLabel.Text = "全体点検が完了しました。ログ欄を確認してください。"
}

function Backup-Data {
  Write-Log "ローカルデータのバックアップを作成しています。"
  Invoke-NodeScript "scripts\backup-data.js"
  $ExportResultLabel.Text = "バックアップを作成しました。保存先はログ欄を確認してください。"
}

function Refresh-All {
  Load-Cards
  Refresh-CardList
  Load-Candidates
  Refresh-CandidateList
  Load-MaintenanceReport
  Refresh-DictionaryFiles
  Update-Status
}

$Form = New-Object System.Windows.Forms.Form
$Form.Text = "Radiology DDX 管理アプリ"
$Form.Size = New-Object System.Drawing.Size(1280, 820)
$Form.MinimumSize = New-Object System.Drawing.Size(1100, 700)
$Form.StartPosition = "CenterScreen"
$Form.Font = New-Object System.Drawing.Font("Yu Gothic UI", 9)

$Header = New-Object System.Windows.Forms.Label
$Header.Text = "Radiology DDX 管理"
$Header.Font = New-Object System.Drawing.Font("Yu Gothic UI", 13, [System.Drawing.FontStyle]::Bold)
$Header.Location = New-Object System.Drawing.Point(12, 10)
$Header.Size = New-Object System.Drawing.Size(260, 28)
$Form.Controls.Add($Header)

$StatusLabel = New-Object System.Windows.Forms.Label
$StatusLabel.Location = New-Object System.Drawing.Point(280, 14)
$StatusLabel.Size = New-Object System.Drawing.Size(960, 24)
$Form.Controls.Add($StatusLabel)

$MainTabs = New-Object System.Windows.Forms.TabControl
$MainTabs.Location = New-Object System.Drawing.Point(12, 48)
$MainTabs.Size = New-Object System.Drawing.Size(1240, 545)
$MainTabs.Anchor = "Top,Left,Right"
$Form.Controls.Add($MainTabs)

$CardsTab = New-Object System.Windows.Forms.TabPage
$CardsTab.Text = "1. 疾患カード"
$DictionaryTab = New-Object System.Windows.Forms.TabPage
$DictionaryTab.Text = "2. 辞書・鑑別グラフ・検索index"
$ExportTab = New-Object System.Windows.Forms.TabPage
$ExportTab.Text = "3. iPhone用ファイル"
$MainTabs.Controls.AddRange(@($CardsTab, $DictionaryTab, $ExportTab))

$CardsHelpLabel = New-Object System.Windows.Forms.Label
$CardsHelpLabel.Text = "下書きを確認して承認します。承認済みカードも選択して編集できます。保存前にJSONとして検査されます。"
$CardsHelpLabel.Location = New-Object System.Drawing.Point(10, 10)
$CardsHelpLabel.Size = New-Object System.Drawing.Size(1180, 22)
$CardsTab.Controls.Add($CardsHelpLabel)

$CardFilterLabel = New-Object System.Windows.Forms.Label
$CardFilterLabel.Text = "検索"
$CardFilterLabel.Location = New-Object System.Drawing.Point(10, 40)
$CardFilterLabel.Size = New-Object System.Drawing.Size(40, 22)
$CardsTab.Controls.Add($CardFilterLabel)

$CardFilterBox = New-Object System.Windows.Forms.TextBox
$CardFilterBox.Location = New-Object System.Drawing.Point(55, 38)
$CardFilterBox.Size = New-Object System.Drawing.Size(215, 24)
$CardsTab.Controls.Add($CardFilterBox)

$ShowDraftOnlyCheck = New-Object System.Windows.Forms.CheckBox
$ShowDraftOnlyCheck.Text = "下書きのみ"
$ShowDraftOnlyCheck.Location = New-Object System.Drawing.Point(280, 40)
$ShowDraftOnlyCheck.Size = New-Object System.Drawing.Size(110, 22)
$CardsTab.Controls.Add($ShowDraftOnlyCheck)

$CardList = New-Object System.Windows.Forms.ListBox
$CardList.Location = New-Object System.Drawing.Point(10, 70)
$CardList.Size = New-Object System.Drawing.Size(390, 365)
$CardsTab.Controls.Add($CardList)

$CardPathLabel = New-Object System.Windows.Forms.Label
$CardPathLabel.Text = "左の一覧から疾患カードを選択してください。"
$CardPathLabel.Location = New-Object System.Drawing.Point(410, 38)
$CardPathLabel.Size = New-Object System.Drawing.Size(800, 24)
$CardsTab.Controls.Add($CardPathLabel)

$CardFormPanel = New-Object System.Windows.Forms.Panel
$CardFormPanel.Location = New-Object System.Drawing.Point(410, 70)
$CardFormPanel.Size = New-Object System.Drawing.Size(800, 365)
$CardFormPanel.Anchor = "Top,Left,Right"
$CardFormPanel.AutoScroll = $true
$CardsTab.Controls.Add($CardFormPanel)

$CardDiseaseIdLabel = New-Object System.Windows.Forms.Label
$CardDiseaseIdLabel.Text = "疾患ID"
$CardDiseaseIdLabel.Location = New-Object System.Drawing.Point(0, 3)
$CardDiseaseIdLabel.Size = New-Object System.Drawing.Size(90, 22)
$CardFormPanel.Controls.Add($CardDiseaseIdLabel)

$CardDiseaseIdBox = New-Object System.Windows.Forms.TextBox
$CardDiseaseIdBox.Location = New-Object System.Drawing.Point(95, 0)
$CardDiseaseIdBox.Size = New-Object System.Drawing.Size(230, 24)
$CardDiseaseIdBox.ReadOnly = $true
$CardFormPanel.Controls.Add($CardDiseaseIdBox)

$CardNameJaLabel = New-Object System.Windows.Forms.Label
$CardNameJaLabel.Text = "疾患名 日本語"
$CardNameJaLabel.Location = New-Object System.Drawing.Point(0, 35)
$CardNameJaLabel.Size = New-Object System.Drawing.Size(90, 22)
$CardFormPanel.Controls.Add($CardNameJaLabel)

$CardNameJaBox = New-Object System.Windows.Forms.TextBox
$CardNameJaBox.Location = New-Object System.Drawing.Point(95, 32)
$CardNameJaBox.Size = New-Object System.Drawing.Size(230, 24)
$CardFormPanel.Controls.Add($CardNameJaBox)

$CardNameEnLabel = New-Object System.Windows.Forms.Label
$CardNameEnLabel.Text = "疾患名 英語"
$CardNameEnLabel.Location = New-Object System.Drawing.Point(345, 35)
$CardNameEnLabel.Size = New-Object System.Drawing.Size(90, 22)
$CardFormPanel.Controls.Add($CardNameEnLabel)

$CardNameEnBox = New-Object System.Windows.Forms.TextBox
$CardNameEnBox.Location = New-Object System.Drawing.Point(440, 32)
$CardNameEnBox.Size = New-Object System.Drawing.Size(310, 24)
$CardFormPanel.Controls.Add($CardNameEnBox)

$CardFrequencyLabelLabel = New-Object System.Windows.Forms.Label
$CardFrequencyLabelLabel.Text = "頻度"
$CardFrequencyLabelLabel.Location = New-Object System.Drawing.Point(0, 67)
$CardFrequencyLabelLabel.Size = New-Object System.Drawing.Size(90, 22)
$CardFormPanel.Controls.Add($CardFrequencyLabelLabel)

$CardFrequencyLabelCombo = New-Object System.Windows.Forms.ComboBox
$CardFrequencyLabelCombo.DropDownStyle = "DropDownList"
$CardFrequencyLabelCombo.Location = New-Object System.Drawing.Point(95, 64)
$CardFrequencyLabelCombo.Size = New-Object System.Drawing.Size(150, 24)
[void]$CardFrequencyLabelCombo.Items.AddRange(@("very_common", "common", "uncommon", "rare", "very_rare", "unknown"))
$CardFormPanel.Controls.Add($CardFrequencyLabelCombo)

$CardPrevalenceRankLabel = New-Object System.Windows.Forms.Label
$CardPrevalenceRankLabel.Text = "頻度rank"
$CardPrevalenceRankLabel.Location = New-Object System.Drawing.Point(260, 67)
$CardPrevalenceRankLabel.Size = New-Object System.Drawing.Size(70, 22)
$CardFormPanel.Controls.Add($CardPrevalenceRankLabel)

$CardPrevalenceRankBox = New-Object System.Windows.Forms.TextBox
$CardPrevalenceRankBox.Location = New-Object System.Drawing.Point(335, 64)
$CardPrevalenceRankBox.Size = New-Object System.Drawing.Size(55, 24)
$CardFormPanel.Controls.Add($CardPrevalenceRankBox)

$CardSexPredilectionLabel = New-Object System.Windows.Forms.Label
$CardSexPredilectionLabel.Text = "性差"
$CardSexPredilectionLabel.Location = New-Object System.Drawing.Point(410, 67)
$CardSexPredilectionLabel.Size = New-Object System.Drawing.Size(50, 22)
$CardFormPanel.Controls.Add($CardSexPredilectionLabel)

$CardSexPredilectionCombo = New-Object System.Windows.Forms.ComboBox
$CardSexPredilectionCombo.DropDownStyle = "DropDownList"
$CardSexPredilectionCombo.Location = New-Object System.Drawing.Point(465, 64)
$CardSexPredilectionCombo.Size = New-Object System.Drawing.Size(180, 24)
[void]$CardSexPredilectionCombo.Items.AddRange(@("female_only", "female_predominant", "no_sex_predilection", "male_predominant", "male_only", "unknown"))
$CardFormPanel.Controls.Add($CardSexPredilectionCombo)

$CardAgeMinLabel = New-Object System.Windows.Forms.Label
$CardAgeMinLabel.Text = "好発年齢"
$CardAgeMinLabel.Location = New-Object System.Drawing.Point(0, 99)
$CardAgeMinLabel.Size = New-Object System.Drawing.Size(90, 22)
$CardFormPanel.Controls.Add($CardAgeMinLabel)

$CardAgeMinBox = New-Object System.Windows.Forms.TextBox
$CardAgeMinBox.Location = New-Object System.Drawing.Point(95, 96)
$CardAgeMinBox.Size = New-Object System.Drawing.Size(55, 24)
$CardFormPanel.Controls.Add($CardAgeMinBox)

$CardAgeToLabel = New-Object System.Windows.Forms.Label
$CardAgeToLabel.Text = "〜"
$CardAgeToLabel.Location = New-Object System.Drawing.Point(157, 99)
$CardAgeToLabel.Size = New-Object System.Drawing.Size(20, 22)
$CardFormPanel.Controls.Add($CardAgeToLabel)

$CardAgeMaxBox = New-Object System.Windows.Forms.TextBox
$CardAgeMaxBox.Location = New-Object System.Drawing.Point(180, 96)
$CardAgeMaxBox.Size = New-Object System.Drawing.Size(55, 24)
$CardFormPanel.Controls.Add($CardAgeMaxBox)

$CardPeakAgeLabel = New-Object System.Windows.Forms.Label
$CardPeakAgeLabel.Text = "ピーク"
$CardPeakAgeLabel.Location = New-Object System.Drawing.Point(250, 99)
$CardPeakAgeLabel.Size = New-Object System.Drawing.Size(60, 22)
$CardFormPanel.Controls.Add($CardPeakAgeLabel)

$CardPeakAgeBox = New-Object System.Windows.Forms.TextBox
$CardPeakAgeBox.Location = New-Object System.Drawing.Point(315, 96)
$CardPeakAgeBox.Size = New-Object System.Drawing.Size(150, 24)
$CardFormPanel.Controls.Add($CardPeakAgeBox)

$CardKeywordsLabel = New-Object System.Windows.Forms.Label
$CardKeywordsLabel.Text = "キーワード"
$CardKeywordsLabel.Location = New-Object System.Drawing.Point(0, 131)
$CardKeywordsLabel.Size = New-Object System.Drawing.Size(90, 22)
$CardFormPanel.Controls.Add($CardKeywordsLabel)

$CardKeywordsBox = New-Object System.Windows.Forms.TextBox
$CardKeywordsBox.Location = New-Object System.Drawing.Point(95, 128)
$CardKeywordsBox.Size = New-Object System.Drawing.Size(655, 24)
$CardFormPanel.Controls.Add($CardKeywordsBox)

$CardFrequencySummaryLabel = New-Object System.Windows.Forms.Label
$CardFrequencySummaryLabel.Text = "頻度メモ"
$CardFrequencySummaryLabel.Location = New-Object System.Drawing.Point(0, 163)
$CardFrequencySummaryLabel.Size = New-Object System.Drawing.Size(90, 22)
$CardFormPanel.Controls.Add($CardFrequencySummaryLabel)

$CardFrequencySummaryBox = New-Object System.Windows.Forms.TextBox
$CardFrequencySummaryBox.Location = New-Object System.Drawing.Point(95, 160)
$CardFrequencySummaryBox.Size = New-Object System.Drawing.Size(655, 44)
$CardFrequencySummaryBox.Multiline = $true
$CardFormPanel.Controls.Add($CardFrequencySummaryBox)

$CardOverviewLabel = New-Object System.Windows.Forms.Label
$CardOverviewLabel.Text = "概要"
$CardOverviewLabel.Location = New-Object System.Drawing.Point(0, 215)
$CardOverviewLabel.Size = New-Object System.Drawing.Size(90, 22)
$CardFormPanel.Controls.Add($CardOverviewLabel)

$CardOverviewBox = New-Object System.Windows.Forms.TextBox
$CardOverviewBox.Location = New-Object System.Drawing.Point(95, 212)
$CardOverviewBox.Size = New-Object System.Drawing.Size(655, 58)
$CardOverviewBox.Multiline = $true
$CardOverviewBox.ScrollBars = "Vertical"
$CardFormPanel.Controls.Add($CardOverviewBox)

$CardTreatmentLabel = New-Object System.Windows.Forms.Label
$CardTreatmentLabel.Text = "治療"
$CardTreatmentLabel.Location = New-Object System.Drawing.Point(0, 281)
$CardTreatmentLabel.Size = New-Object System.Drawing.Size(90, 22)
$CardFormPanel.Controls.Add($CardTreatmentLabel)

$CardTreatmentBox = New-Object System.Windows.Forms.TextBox
$CardTreatmentBox.Location = New-Object System.Drawing.Point(95, 278)
$CardTreatmentBox.Size = New-Object System.Drawing.Size(655, 58)
$CardTreatmentBox.Multiline = $true
$CardTreatmentBox.ScrollBars = "Vertical"
$CardFormPanel.Controls.Add($CardTreatmentBox)

$CardEpidemiologyLabel = New-Object System.Windows.Forms.Label
$CardEpidemiologyLabel.Text = "疫学"
$CardEpidemiologyLabel.Location = New-Object System.Drawing.Point(0, 347)
$CardEpidemiologyLabel.Size = New-Object System.Drawing.Size(90, 22)
$CardFormPanel.Controls.Add($CardEpidemiologyLabel)

$CardEpidemiologyBox = New-Object System.Windows.Forms.TextBox
$CardEpidemiologyBox.Location = New-Object System.Drawing.Point(95, 344)
$CardEpidemiologyBox.Size = New-Object System.Drawing.Size(655, 44)
$CardEpidemiologyBox.Multiline = $true
$CardFormPanel.Controls.Add($CardEpidemiologyBox)

$CardSexSummaryLabel = New-Object System.Windows.Forms.Label
$CardSexSummaryLabel.Text = "性差メモ"
$CardSexSummaryLabel.Location = New-Object System.Drawing.Point(0, 399)
$CardSexSummaryLabel.Size = New-Object System.Drawing.Size(90, 22)
$CardFormPanel.Controls.Add($CardSexSummaryLabel)

$CardSexSummaryBox = New-Object System.Windows.Forms.TextBox
$CardSexSummaryBox.Location = New-Object System.Drawing.Point(95, 396)
$CardSexSummaryBox.Size = New-Object System.Drawing.Size(655, 44)
$CardSexSummaryBox.Multiline = $true
$CardFormPanel.Controls.Add($CardSexSummaryBox)

$CardAgeSummaryLabel = New-Object System.Windows.Forms.Label
$CardAgeSummaryLabel.Text = "年齢メモ"
$CardAgeSummaryLabel.Location = New-Object System.Drawing.Point(0, 451)
$CardAgeSummaryLabel.Size = New-Object System.Drawing.Size(90, 22)
$CardFormPanel.Controls.Add($CardAgeSummaryLabel)

$CardAgeSummaryBox = New-Object System.Windows.Forms.TextBox
$CardAgeSummaryBox.Location = New-Object System.Drawing.Point(95, 448)
$CardAgeSummaryBox.Size = New-Object System.Drawing.Size(655, 44)
$CardAgeSummaryBox.Multiline = $true
$CardFormPanel.Controls.Add($CardAgeSummaryBox)

$CardEvidenceSummaryLabel = New-Object System.Windows.Forms.Label
$CardEvidenceSummaryLabel.Text = "出典サマリー"
$CardEvidenceSummaryLabel.Location = New-Object System.Drawing.Point(0, 503)
$CardEvidenceSummaryLabel.Size = New-Object System.Drawing.Size(90, 22)
$CardFormPanel.Controls.Add($CardEvidenceSummaryLabel)

$CardEvidenceSummaryBox = New-Object System.Windows.Forms.TextBox
$CardEvidenceSummaryBox.Location = New-Object System.Drawing.Point(95, 500)
$CardEvidenceSummaryBox.Size = New-Object System.Drawing.Size(655, 44)
$CardEvidenceSummaryBox.Multiline = $true
$CardFormPanel.Controls.Add($CardEvidenceSummaryBox)

$CardReviewNotesLabel = New-Object System.Windows.Forms.Label
$CardReviewNotesLabel.Text = "レビュー備考"
$CardReviewNotesLabel.Location = New-Object System.Drawing.Point(0, 555)
$CardReviewNotesLabel.Size = New-Object System.Drawing.Size(90, 22)
$CardFormPanel.Controls.Add($CardReviewNotesLabel)

$CardReviewNotesBox = New-Object System.Windows.Forms.TextBox
$CardReviewNotesBox.Location = New-Object System.Drawing.Point(95, 552)
$CardReviewNotesBox.Size = New-Object System.Drawing.Size(655, 58)
$CardReviewNotesBox.Multiline = $true
$CardReviewNotesBox.ScrollBars = "Vertical"
$CardFormPanel.Controls.Add($CardReviewNotesBox)

$FindingSectionLabel = New-Object System.Windows.Forms.Label
$FindingSectionLabel.Text = "画像所見（CT/MRI）"
$FindingSectionLabel.Font = New-Object System.Drawing.Font("Meiryo UI", 9, [System.Drawing.FontStyle]::Bold)
$FindingSectionLabel.Location = New-Object System.Drawing.Point(0, 625)
$FindingSectionLabel.Size = New-Object System.Drawing.Size(180, 22)
$CardFormPanel.Controls.Add($FindingSectionLabel)

$FindingCountLabel = New-Object System.Windows.Forms.Label
$FindingCountLabel.Text = "所見数: 0"
$FindingCountLabel.Location = New-Object System.Drawing.Point(190, 625)
$FindingCountLabel.Size = New-Object System.Drawing.Size(120, 22)
$CardFormPanel.Controls.Add($FindingCountLabel)

$FindingHelpLabel = New-Object System.Windows.Forms.Label
$FindingHelpLabel.Text = "一覧から所見を選び、下の欄で編集します。新規追加や大幅な構造変更はJSON原文で行ってください。"
$FindingHelpLabel.Location = New-Object System.Drawing.Point(315, 625)
$FindingHelpLabel.Size = New-Object System.Drawing.Size(440, 22)
$CardFormPanel.Controls.Add($FindingHelpLabel)

$FindingGrid = New-Object System.Windows.Forms.DataGridView
$FindingGrid.Location = New-Object System.Drawing.Point(95, 650)
$FindingGrid.Size = New-Object System.Drawing.Size(655, 150)
$FindingGrid.ReadOnly = $true
$FindingGrid.AllowUserToAddRows = $false
$FindingGrid.AllowUserToDeleteRows = $false
$FindingGrid.MultiSelect = $false
$FindingGrid.SelectionMode = "FullRowSelect"
$FindingGrid.RowHeadersVisible = $false
$FindingGrid.AutoSizeRowsMode = "DisplayedCells"
$FindingGrid.ScrollBars = "Both"
[void]$FindingGrid.Columns.Add("modality", "Mod")
[void]$FindingGrid.Columns.Add("acquisition", "撮像")
[void]$FindingGrid.Columns.Add("finding_code", "所見コード")
[void]$FindingGrid.Columns.Add("typicality", "典型度")
[void]$FindingGrid.Columns.Add("weight", "点")
[void]$FindingGrid.Columns.Add("status", "状態")
[void]$FindingGrid.Columns.Add("text", "所見文")
$FindingGrid.Columns[0].Width = 45
$FindingGrid.Columns[1].Width = 105
$FindingGrid.Columns[2].Width = 180
$FindingGrid.Columns[3].Width = 70
$FindingGrid.Columns[4].Width = 45
$FindingGrid.Columns[5].Width = 70
$FindingGrid.Columns[6].Width = 260
$CardFormPanel.Controls.Add($FindingGrid)

$FindingIdLabel = New-Object System.Windows.Forms.Label
$FindingIdLabel.Text = "所見ID"
$FindingIdLabel.Location = New-Object System.Drawing.Point(0, 815)
$FindingIdLabel.Size = New-Object System.Drawing.Size(90, 22)
$CardFormPanel.Controls.Add($FindingIdLabel)

$FindingIdBox = New-Object System.Windows.Forms.TextBox
$FindingIdBox.Location = New-Object System.Drawing.Point(95, 812)
$FindingIdBox.Size = New-Object System.Drawing.Size(300, 24)
$FindingIdBox.ReadOnly = $true
$CardFormPanel.Controls.Add($FindingIdBox)

$FindingModalityLabel = New-Object System.Windows.Forms.Label
$FindingModalityLabel.Text = "モダリティ"
$FindingModalityLabel.Location = New-Object System.Drawing.Point(410, 815)
$FindingModalityLabel.Size = New-Object System.Drawing.Size(80, 22)
$CardFormPanel.Controls.Add($FindingModalityLabel)

$FindingModalityCombo = New-Object System.Windows.Forms.ComboBox
$FindingModalityCombo.DropDownStyle = "DropDownList"
$FindingModalityCombo.Location = New-Object System.Drawing.Point(495, 812)
$FindingModalityCombo.Size = New-Object System.Drawing.Size(90, 24)
[void]$FindingModalityCombo.Items.AddRange(@("MRI", "CT"))
$FindingModalityCombo.Enabled = $false
$CardFormPanel.Controls.Add($FindingModalityCombo)

$FindingAcquisitionLabel = New-Object System.Windows.Forms.Label
$FindingAcquisitionLabel.Text = "撮像/相"
$FindingAcquisitionLabel.Location = New-Object System.Drawing.Point(595, 815)
$FindingAcquisitionLabel.Size = New-Object System.Drawing.Size(65, 22)
$CardFormPanel.Controls.Add($FindingAcquisitionLabel)

$FindingAcquisitionBox = New-Object System.Windows.Forms.TextBox
$FindingAcquisitionBox.Location = New-Object System.Drawing.Point(660, 812)
$FindingAcquisitionBox.Size = New-Object System.Drawing.Size(90, 24)
$FindingAcquisitionBox.ReadOnly = $true
$CardFormPanel.Controls.Add($FindingAcquisitionBox)

$FindingCodeLabel = New-Object System.Windows.Forms.Label
$FindingCodeLabel.Text = "所見コード"
$FindingCodeLabel.Location = New-Object System.Drawing.Point(0, 847)
$FindingCodeLabel.Size = New-Object System.Drawing.Size(90, 22)
$CardFormPanel.Controls.Add($FindingCodeLabel)

$FindingCodeBox = New-Object System.Windows.Forms.TextBox
$FindingCodeBox.Location = New-Object System.Drawing.Point(95, 844)
$FindingCodeBox.Size = New-Object System.Drawing.Size(300, 24)
$CardFormPanel.Controls.Add($FindingCodeBox)

$FindingTargetLabel = New-Object System.Windows.Forms.Label
$FindingTargetLabel.Text = "部位/対象"
$FindingTargetLabel.Location = New-Object System.Drawing.Point(410, 847)
$FindingTargetLabel.Size = New-Object System.Drawing.Size(80, 22)
$CardFormPanel.Controls.Add($FindingTargetLabel)

$FindingTargetBox = New-Object System.Windows.Forms.TextBox
$FindingTargetBox.Location = New-Object System.Drawing.Point(495, 844)
$FindingTargetBox.Size = New-Object System.Drawing.Size(255, 24)
$CardFormPanel.Controls.Add($FindingTargetBox)

$FindingTypicalityLabel = New-Object System.Windows.Forms.Label
$FindingTypicalityLabel.Text = "典型度"
$FindingTypicalityLabel.Location = New-Object System.Drawing.Point(0, 879)
$FindingTypicalityLabel.Size = New-Object System.Drawing.Size(90, 22)
$CardFormPanel.Controls.Add($FindingTypicalityLabel)

$FindingTypicalityCombo = New-Object System.Windows.Forms.ComboBox
$FindingTypicalityCombo.DropDownStyle = "DropDownList"
$FindingTypicalityCombo.Location = New-Object System.Drawing.Point(95, 876)
$FindingTypicalityCombo.Size = New-Object System.Drawing.Size(140, 24)
[void]$FindingTypicalityCombo.Items.AddRange(@("typical", "common", "variable", "rare", "negative"))
$CardFormPanel.Controls.Add($FindingTypicalityCombo)

$FindingWeightLabel = New-Object System.Windows.Forms.Label
$FindingWeightLabel.Text = "重み"
$FindingWeightLabel.Location = New-Object System.Drawing.Point(250, 879)
$FindingWeightLabel.Size = New-Object System.Drawing.Size(45, 22)
$CardFormPanel.Controls.Add($FindingWeightLabel)

$FindingWeightBox = New-Object System.Windows.Forms.TextBox
$FindingWeightBox.Location = New-Object System.Drawing.Point(300, 876)
$FindingWeightBox.Size = New-Object System.Drawing.Size(55, 24)
$CardFormPanel.Controls.Add($FindingWeightBox)

$FindingReviewStatusLabel = New-Object System.Windows.Forms.Label
$FindingReviewStatusLabel.Text = "レビュー"
$FindingReviewStatusLabel.Location = New-Object System.Drawing.Point(370, 879)
$FindingReviewStatusLabel.Size = New-Object System.Drawing.Size(70, 22)
$CardFormPanel.Controls.Add($FindingReviewStatusLabel)

$FindingReviewStatusCombo = New-Object System.Windows.Forms.ComboBox
$FindingReviewStatusCombo.DropDownStyle = "DropDownList"
$FindingReviewStatusCombo.Location = New-Object System.Drawing.Point(445, 876)
$FindingReviewStatusCombo.Size = New-Object System.Drawing.Size(120, 24)
[void]$FindingReviewStatusCombo.Items.AddRange(@("draft", "reviewed", "approved", "needs_mapping"))
$CardFormPanel.Controls.Add($FindingReviewStatusCombo)

$FindingNegativeCheck = New-Object System.Windows.Forms.CheckBox
$FindingNegativeCheck.Text = "否定所見"
$FindingNegativeCheck.Location = New-Object System.Drawing.Point(585, 878)
$FindingNegativeCheck.Size = New-Object System.Drawing.Size(100, 22)
$CardFormPanel.Controls.Add($FindingNegativeCheck)

$ApplyFindingButton = New-Object System.Windows.Forms.Button
$ApplyFindingButton.Text = "所見に反映"
$ApplyFindingButton.Location = New-Object System.Drawing.Point(675, 874)
$ApplyFindingButton.Size = New-Object System.Drawing.Size(75, 28)
$CardFormPanel.Controls.Add($ApplyFindingButton)

$FindingKeywordsLabel = New-Object System.Windows.Forms.Label
$FindingKeywordsLabel.Text = "所見キーワード"
$FindingKeywordsLabel.Location = New-Object System.Drawing.Point(0, 911)
$FindingKeywordsLabel.Size = New-Object System.Drawing.Size(90, 22)
$CardFormPanel.Controls.Add($FindingKeywordsLabel)

$FindingKeywordsBox = New-Object System.Windows.Forms.TextBox
$FindingKeywordsBox.Location = New-Object System.Drawing.Point(95, 908)
$FindingKeywordsBox.Size = New-Object System.Drawing.Size(655, 24)
$CardFormPanel.Controls.Add($FindingKeywordsBox)

$FindingTextLabel = New-Object System.Windows.Forms.Label
$FindingTextLabel.Text = "所見文"
$FindingTextLabel.Location = New-Object System.Drawing.Point(0, 943)
$FindingTextLabel.Size = New-Object System.Drawing.Size(90, 22)
$CardFormPanel.Controls.Add($FindingTextLabel)

$FindingTextBox = New-Object System.Windows.Forms.TextBox
$FindingTextBox.Location = New-Object System.Drawing.Point(95, 940)
$FindingTextBox.Size = New-Object System.Drawing.Size(655, 78)
$FindingTextBox.Multiline = $true
$FindingTextBox.ScrollBars = "Vertical"
$CardFormPanel.Controls.Add($FindingTextBox)

$RawFindingTitleLabel = New-Object System.Windows.Forms.Label
$RawFindingTitleLabel.Text = "自由記載所見 raw_findings"
$RawFindingTitleLabel.Location = New-Object System.Drawing.Point(0, 1040)
$RawFindingTitleLabel.Size = New-Object System.Drawing.Size(180, 22)
$CardFormPanel.Controls.Add($RawFindingTitleLabel)

$RawFindingCountLabel = New-Object System.Windows.Forms.Label
$RawFindingCountLabel.Text = "自由記載: 0"
$RawFindingCountLabel.Location = New-Object System.Drawing.Point(190, 1040)
$RawFindingCountLabel.Size = New-Object System.Drawing.Size(120, 22)
$CardFormPanel.Controls.Add($RawFindingCountLabel)

$RawFindingHelpLabel = New-Object System.Windows.Forms.Label
$RawFindingHelpLabel.Text = "辞書に未対応の所見・named sign・部位表現を保持します。編集後は「自由記載に反映」してから保存します。"
$RawFindingHelpLabel.Location = New-Object System.Drawing.Point(315, 1040)
$RawFindingHelpLabel.Size = New-Object System.Drawing.Size(440, 22)
$CardFormPanel.Controls.Add($RawFindingHelpLabel)

$RawFindingGrid = New-Object System.Windows.Forms.DataGridView
$RawFindingGrid.Location = New-Object System.Drawing.Point(95, 1065)
$RawFindingGrid.Size = New-Object System.Drawing.Size(655, 130)
$RawFindingGrid.ReadOnly = $true
$RawFindingGrid.AllowUserToAddRows = $false
$RawFindingGrid.AllowUserToDeleteRows = $false
$RawFindingGrid.MultiSelect = $false
$RawFindingGrid.SelectionMode = "FullRowSelect"
$RawFindingGrid.RowHeadersVisible = $false
$RawFindingGrid.AutoSizeRowsMode = "DisplayedCells"
$RawFindingGrid.ScrollBars = "Both"
[void]$RawFindingGrid.Columns.Add("raw_finding_id", "ID")
[void]$RawFindingGrid.Columns.Add("modality", "Mod")
[void]$RawFindingGrid.Columns.Add("acquisition", "撮像")
[void]$RawFindingGrid.Columns.Add("status", "mapping")
[void]$RawFindingGrid.Columns.Add("text", "自由記載所見")
$RawFindingGrid.Columns[0].Width = 180
$RawFindingGrid.Columns[1].Width = 55
$RawFindingGrid.Columns[2].Width = 100
$RawFindingGrid.Columns[3].Width = 90
$RawFindingGrid.Columns[4].Width = 300
$CardFormPanel.Controls.Add($RawFindingGrid)

$RawFindingIdLabel = New-Object System.Windows.Forms.Label
$RawFindingIdLabel.Text = "raw ID"
$RawFindingIdLabel.Location = New-Object System.Drawing.Point(0, 1210)
$RawFindingIdLabel.Size = New-Object System.Drawing.Size(90, 22)
$CardFormPanel.Controls.Add($RawFindingIdLabel)

$RawFindingIdBox = New-Object System.Windows.Forms.TextBox
$RawFindingIdBox.Location = New-Object System.Drawing.Point(95, 1207)
$RawFindingIdBox.Size = New-Object System.Drawing.Size(300, 24)
$RawFindingIdBox.ReadOnly = $true
$CardFormPanel.Controls.Add($RawFindingIdBox)

$RawMappingStatusLabel = New-Object System.Windows.Forms.Label
$RawMappingStatusLabel.Text = "mapping"
$RawMappingStatusLabel.Location = New-Object System.Drawing.Point(410, 1210)
$RawMappingStatusLabel.Size = New-Object System.Drawing.Size(80, 22)
$CardFormPanel.Controls.Add($RawMappingStatusLabel)

$RawMappingStatusCombo = New-Object System.Windows.Forms.ComboBox
$RawMappingStatusCombo.DropDownStyle = "DropDownList"
$RawMappingStatusCombo.Location = New-Object System.Drawing.Point(495, 1207)
$RawMappingStatusCombo.Size = New-Object System.Drawing.Size(120, 24)
[void]$RawMappingStatusCombo.Items.AddRange(@("unmapped", "candidate", "mapped", "deferred", "rejected"))
$CardFormPanel.Controls.Add($RawMappingStatusCombo)

$RawReviewStatusLabel = New-Object System.Windows.Forms.Label
$RawReviewStatusLabel.Text = "レビュー"
$RawReviewStatusLabel.Location = New-Object System.Drawing.Point(625, 1210)
$RawReviewStatusLabel.Size = New-Object System.Drawing.Size(60, 22)
$CardFormPanel.Controls.Add($RawReviewStatusLabel)

$RawReviewStatusCombo = New-Object System.Windows.Forms.ComboBox
$RawReviewStatusCombo.DropDownStyle = "DropDownList"
$RawReviewStatusCombo.Location = New-Object System.Drawing.Point(690, 1207)
$RawReviewStatusCombo.Size = New-Object System.Drawing.Size(60, 24)
[void]$RawReviewStatusCombo.Items.AddRange(@("draft", "needs_mapping", "reviewed", "approved", "rejected"))
$CardFormPanel.Controls.Add($RawReviewStatusCombo)

$RawModalityLabel = New-Object System.Windows.Forms.Label
$RawModalityLabel.Text = "Mod text"
$RawModalityLabel.Location = New-Object System.Drawing.Point(0, 1242)
$RawModalityLabel.Size = New-Object System.Drawing.Size(90, 22)
$CardFormPanel.Controls.Add($RawModalityLabel)

$RawModalityBox = New-Object System.Windows.Forms.TextBox
$RawModalityBox.Location = New-Object System.Drawing.Point(95, 1239)
$RawModalityBox.Size = New-Object System.Drawing.Size(120, 24)
$CardFormPanel.Controls.Add($RawModalityBox)

$RawAcquisitionLabel = New-Object System.Windows.Forms.Label
$RawAcquisitionLabel.Text = "撮像text"
$RawAcquisitionLabel.Location = New-Object System.Drawing.Point(225, 1242)
$RawAcquisitionLabel.Size = New-Object System.Drawing.Size(70, 22)
$CardFormPanel.Controls.Add($RawAcquisitionLabel)

$RawAcquisitionBox = New-Object System.Windows.Forms.TextBox
$RawAcquisitionBox.Location = New-Object System.Drawing.Point(300, 1239)
$RawAcquisitionBox.Size = New-Object System.Drawing.Size(185, 24)
$CardFormPanel.Controls.Add($RawAcquisitionBox)

$RawAnatomyLabel = New-Object System.Windows.Forms.Label
$RawAnatomyLabel.Text = "部位text"
$RawAnatomyLabel.Location = New-Object System.Drawing.Point(495, 1242)
$RawAnatomyLabel.Size = New-Object System.Drawing.Size(70, 22)
$CardFormPanel.Controls.Add($RawAnatomyLabel)

$RawAnatomyBox = New-Object System.Windows.Forms.TextBox
$RawAnatomyBox.Location = New-Object System.Drawing.Point(570, 1239)
$RawAnatomyBox.Size = New-Object System.Drawing.Size(180, 24)
$CardFormPanel.Controls.Add($RawAnatomyBox)

$RawTargetLabel = New-Object System.Windows.Forms.Label
$RawTargetLabel.Text = "対象text"
$RawTargetLabel.Location = New-Object System.Drawing.Point(0, 1274)
$RawTargetLabel.Size = New-Object System.Drawing.Size(90, 22)
$CardFormPanel.Controls.Add($RawTargetLabel)

$RawTargetBox = New-Object System.Windows.Forms.TextBox
$RawTargetBox.Location = New-Object System.Drawing.Point(95, 1271)
$RawTargetBox.Size = New-Object System.Drawing.Size(300, 24)
$CardFormPanel.Controls.Add($RawTargetBox)

$ApplyRawFindingButton = New-Object System.Windows.Forms.Button
$ApplyRawFindingButton.Text = "自由記載に反映"
$ApplyRawFindingButton.Location = New-Object System.Drawing.Point(625, 1269)
$ApplyRawFindingButton.Size = New-Object System.Drawing.Size(125, 28)
$CardFormPanel.Controls.Add($ApplyRawFindingButton)

$RawCandidateCodeLabel = New-Object System.Windows.Forms.Label
$RawCandidateCodeLabel.Text = "候補所見code"
$RawCandidateCodeLabel.Location = New-Object System.Drawing.Point(0, 1306)
$RawCandidateCodeLabel.Size = New-Object System.Drawing.Size(90, 22)
$CardFormPanel.Controls.Add($RawCandidateCodeLabel)

$RawCandidateCodeBox = New-Object System.Windows.Forms.TextBox
$RawCandidateCodeBox.Location = New-Object System.Drawing.Point(95, 1303)
$RawCandidateCodeBox.Size = New-Object System.Drawing.Size(300, 24)
$CardFormPanel.Controls.Add($RawCandidateCodeBox)

$RawCandidateAcquisitionLabel = New-Object System.Windows.Forms.Label
$RawCandidateAcquisitionLabel.Text = "候補撮像"
$RawCandidateAcquisitionLabel.Location = New-Object System.Drawing.Point(410, 1306)
$RawCandidateAcquisitionLabel.Size = New-Object System.Drawing.Size(80, 22)
$CardFormPanel.Controls.Add($RawCandidateAcquisitionLabel)

$RawCandidateAcquisitionBox = New-Object System.Windows.Forms.TextBox
$RawCandidateAcquisitionBox.Location = New-Object System.Drawing.Point(495, 1303)
$RawCandidateAcquisitionBox.Size = New-Object System.Drawing.Size(100, 24)
$CardFormPanel.Controls.Add($RawCandidateAcquisitionBox)

$RawCandidateTargetLabel = New-Object System.Windows.Forms.Label
$RawCandidateTargetLabel.Text = "候補target"
$RawCandidateTargetLabel.Location = New-Object System.Drawing.Point(605, 1306)
$RawCandidateTargetLabel.Size = New-Object System.Drawing.Size(80, 22)
$CardFormPanel.Controls.Add($RawCandidateTargetLabel)

$RawCandidateTargetBox = New-Object System.Windows.Forms.TextBox
$RawCandidateTargetBox.Location = New-Object System.Drawing.Point(690, 1303)
$RawCandidateTargetBox.Size = New-Object System.Drawing.Size(60, 24)
$CardFormPanel.Controls.Add($RawCandidateTargetBox)

$RawFindingTextLabel = New-Object System.Windows.Forms.Label
$RawFindingTextLabel.Text = "自由記載所見"
$RawFindingTextLabel.Location = New-Object System.Drawing.Point(0, 1338)
$RawFindingTextLabel.Size = New-Object System.Drawing.Size(90, 22)
$CardFormPanel.Controls.Add($RawFindingTextLabel)

$RawFindingTextBox = New-Object System.Windows.Forms.TextBox
$RawFindingTextBox.Location = New-Object System.Drawing.Point(95, 1335)
$RawFindingTextBox.Size = New-Object System.Drawing.Size(655, 58)
$RawFindingTextBox.Multiline = $true
$RawFindingTextBox.ScrollBars = "Vertical"
$CardFormPanel.Controls.Add($RawFindingTextBox)

$RawInterpretationLabel = New-Object System.Windows.Forms.Label
$RawInterpretationLabel.Text = "解釈"
$RawInterpretationLabel.Location = New-Object System.Drawing.Point(0, 1405)
$RawInterpretationLabel.Size = New-Object System.Drawing.Size(90, 22)
$CardFormPanel.Controls.Add($RawInterpretationLabel)

$RawInterpretationBox = New-Object System.Windows.Forms.TextBox
$RawInterpretationBox.Location = New-Object System.Drawing.Point(95, 1402)
$RawInterpretationBox.Size = New-Object System.Drawing.Size(655, 48)
$RawInterpretationBox.Multiline = $true
$RawInterpretationBox.ScrollBars = "Vertical"
$CardFormPanel.Controls.Add($RawInterpretationBox)

$RawMappingNotesLabel = New-Object System.Windows.Forms.Label
$RawMappingNotesLabel.Text = "mapping note"
$RawMappingNotesLabel.Location = New-Object System.Drawing.Point(0, 1462)
$RawMappingNotesLabel.Size = New-Object System.Drawing.Size(90, 22)
$CardFormPanel.Controls.Add($RawMappingNotesLabel)

$RawMappingNotesBox = New-Object System.Windows.Forms.TextBox
$RawMappingNotesBox.Location = New-Object System.Drawing.Point(95, 1459)
$RawMappingNotesBox.Size = New-Object System.Drawing.Size(655, 48)
$RawMappingNotesBox.Multiline = $true
$RawMappingNotesBox.ScrollBars = "Vertical"
$CardFormPanel.Controls.Add($RawMappingNotesBox)

$CardFormBottomSpacer = New-Object System.Windows.Forms.Label
$CardFormBottomSpacer.Text = ""
$CardFormBottomSpacer.Location = New-Object System.Drawing.Point(0, 1530)
$CardFormBottomSpacer.Size = New-Object System.Drawing.Size(1, 1)
$CardFormPanel.Controls.Add($CardFormBottomSpacer)

$CardEditor = New-Object System.Windows.Forms.TextBox
$CardEditor.Multiline = $true
$CardEditor.ScrollBars = "Both"
$CardEditor.Font = New-Object System.Drawing.Font("Consolas", 9)
$CardEditor.Location = New-Object System.Drawing.Point(410, 70)
$CardEditor.Size = New-Object System.Drawing.Size(800, 365)
$CardEditor.Anchor = "Top,Left,Right"
$CardEditor.Visible = $false
$CardsTab.Controls.Add($CardEditor)

$CardSaveButton = New-Object System.Windows.Forms.Button
$CardSaveButton.Text = "保存"
$CardSaveButton.Location = New-Object System.Drawing.Point(410, 448)
$CardSaveButton.Size = New-Object System.Drawing.Size(110, 30)
$CardsTab.Controls.Add($CardSaveButton)

$ApproveDraftButton = New-Object System.Windows.Forms.Button
$ApproveDraftButton.Text = "下書きを承認"
$ApproveDraftButton.Location = New-Object System.Drawing.Point(530, 448)
$ApproveDraftButton.Size = New-Object System.Drawing.Size(130, 30)
$CardsTab.Controls.Add($ApproveDraftButton)

$CardReloadButton = New-Object System.Windows.Forms.Button
$CardReloadButton.Text = "再読み込み"
$CardReloadButton.Location = New-Object System.Drawing.Point(670, 448)
$CardReloadButton.Size = New-Object System.Drawing.Size(110, 30)
$CardsTab.Controls.Add($CardReloadButton)

$CardDeleteButton = New-Object System.Windows.Forms.Button
$CardDeleteButton.Text = "削除"
$CardDeleteButton.Location = New-Object System.Drawing.Point(790, 448)
$CardDeleteButton.Size = New-Object System.Drawing.Size(80, 30)
$CardDeleteButton.BackColor = [System.Drawing.Color]::MistyRose
$CardsTab.Controls.Add($CardDeleteButton)

$CardRawToggleButton = New-Object System.Windows.Forms.Button
$CardRawToggleButton.Text = "JSON原文を開く"
$CardRawToggleButton.Location = New-Object System.Drawing.Point(880, 448)
$CardRawToggleButton.Size = New-Object System.Drawing.Size(130, 30)
$CardsTab.Controls.Add($CardRawToggleButton)

$ManualTab = $DictionaryTab

$MaintenanceButton = New-Object System.Windows.Forms.Button
$MaintenanceButton.Text = "辞書候補・index更新"
$MaintenanceButton.Location = New-Object System.Drawing.Point(10, 10)
$MaintenanceButton.Size = New-Object System.Drawing.Size(170, 30)
$ManualTab.Controls.Add($MaintenanceButton)

$BuildIndexButton = New-Object System.Windows.Forms.Button
$BuildIndexButton.Text = "鑑別グラフ・検索indexのみ作成"
$BuildIndexButton.Location = New-Object System.Drawing.Point(190, 10)
$BuildIndexButton.Size = New-Object System.Drawing.Size(210, 30)
$ManualTab.Controls.Add($BuildIndexButton)

$ReportLabel = New-Object System.Windows.Forms.Label
$ReportLabel.Text = "更新結果"
$ReportLabel.Location = New-Object System.Drawing.Point(420, 14)
$ReportLabel.Size = New-Object System.Drawing.Size(80, 20)
$ManualTab.Controls.Add($ReportLabel)

$ReportBox = New-Object System.Windows.Forms.TextBox
$ReportBox.Multiline = $true
$ReportBox.ScrollBars = "Both"
$ReportBox.Font = New-Object System.Drawing.Font("Consolas", 9)
$ReportBox.Location = New-Object System.Drawing.Point(500, 10)
$ReportBox.Size = New-Object System.Drawing.Size(690, 54)
$ReportBox.ReadOnly = $true
$ManualTab.Controls.Add($ReportBox)

$ManualHelpLabel = New-Object System.Windows.Forms.Label
$ManualHelpLabel.Text = "辞書ファイルを選んで編集します。finding-concepts.json はフォームで編集できます。必要な時だけJSON原文を開きます。"
$ManualHelpLabel.Location = New-Object System.Drawing.Point(10, 50)
$ManualHelpLabel.Size = New-Object System.Drawing.Size(1180, 22)
$ManualTab.Controls.Add($ManualHelpLabel)

$DictionaryFileCombo = New-Object System.Windows.Forms.ComboBox
$DictionaryFileCombo.DropDownStyle = "DropDownList"
$DictionaryFileCombo.Location = New-Object System.Drawing.Point(10, 80)
$DictionaryFileCombo.Size = New-Object System.Drawing.Size(280, 24)
$ManualTab.Controls.Add($DictionaryFileCombo)

$LoadDictionaryButton = New-Object System.Windows.Forms.Button
$LoadDictionaryButton.Text = "読み込み"
$LoadDictionaryButton.Location = New-Object System.Drawing.Point(300, 78)
$LoadDictionaryButton.Size = New-Object System.Drawing.Size(80, 28)
$ManualTab.Controls.Add($LoadDictionaryButton)

$SaveDictionaryButton = New-Object System.Windows.Forms.Button
$SaveDictionaryButton.Text = "JSON原文を保存"
$SaveDictionaryButton.Location = New-Object System.Drawing.Point(390, 78)
$SaveDictionaryButton.Size = New-Object System.Drawing.Size(130, 28)
$ManualTab.Controls.Add($SaveDictionaryButton)

$DictionaryRawToggleButton = New-Object System.Windows.Forms.Button
$DictionaryRawToggleButton.Text = "JSON原文を開く"
$DictionaryRawToggleButton.Location = New-Object System.Drawing.Point(530, 78)
$DictionaryRawToggleButton.Size = New-Object System.Drawing.Size(130, 28)
$ManualTab.Controls.Add($DictionaryRawToggleButton)

$DictionaryFriendlyMessage = New-Object System.Windows.Forms.Label
$DictionaryFriendlyMessage.Text = "辞書ファイルを選択してください。finding-concepts.json はフォームで編集できます。"
$DictionaryFriendlyMessage.Location = New-Object System.Drawing.Point(10, 120)
$DictionaryFriendlyMessage.Size = New-Object System.Drawing.Size(1180, 24)
$ManualTab.Controls.Add($DictionaryFriendlyMessage)

$ConceptEditorPanel = New-Object System.Windows.Forms.Panel
$ConceptEditorPanel.Location = New-Object System.Drawing.Point(10, 116)
$ConceptEditorPanel.Size = New-Object System.Drawing.Size(1180, 360)
$ConceptEditorPanel.Visible = $false
$ManualTab.Controls.Add($ConceptEditorPanel)

$ConceptFilterLabel = New-Object System.Windows.Forms.Label
$ConceptFilterLabel.Text = "概念検索"
$ConceptFilterLabel.Location = New-Object System.Drawing.Point(0, 3)
$ConceptFilterLabel.Size = New-Object System.Drawing.Size(70, 22)
$ConceptEditorPanel.Controls.Add($ConceptFilterLabel)

$ConceptFilterBox = New-Object System.Windows.Forms.TextBox
$ConceptFilterBox.Location = New-Object System.Drawing.Point(75, 0)
$ConceptFilterBox.Size = New-Object System.Drawing.Size(295, 24)
$ConceptEditorPanel.Controls.Add($ConceptFilterBox)

$ConceptList = New-Object System.Windows.Forms.ListBox
$ConceptList.Location = New-Object System.Drawing.Point(0, 32)
$ConceptList.Size = New-Object System.Drawing.Size(370, 320)
$ConceptEditorPanel.Controls.Add($ConceptList)

$ConceptIdLabel = New-Object System.Windows.Forms.Label
$ConceptIdLabel.Text = "概念ID"
$ConceptIdLabel.Location = New-Object System.Drawing.Point(390, 3)
$ConceptIdLabel.Size = New-Object System.Drawing.Size(80, 22)
$ConceptEditorPanel.Controls.Add($ConceptIdLabel)

$ConceptIdBox = New-Object System.Windows.Forms.TextBox
$ConceptIdBox.Location = New-Object System.Drawing.Point(480, 0)
$ConceptIdBox.Size = New-Object System.Drawing.Size(290, 24)
$ConceptIdBox.ReadOnly = $true
$ConceptEditorPanel.Controls.Add($ConceptIdBox)

$SaveConceptButton = New-Object System.Windows.Forms.Button
$SaveConceptButton.Text = "この概念を保存"
$SaveConceptButton.Location = New-Object System.Drawing.Point(790, 0)
$SaveConceptButton.Size = New-Object System.Drawing.Size(130, 28)
$ConceptEditorPanel.Controls.Add($SaveConceptButton)

$ConceptLabelJaLabel = New-Object System.Windows.Forms.Label
$ConceptLabelJaLabel.Text = "表示名 日本語"
$ConceptLabelJaLabel.Location = New-Object System.Drawing.Point(390, 37)
$ConceptLabelJaLabel.Size = New-Object System.Drawing.Size(90, 22)
$ConceptEditorPanel.Controls.Add($ConceptLabelJaLabel)

$ConceptLabelJaBox = New-Object System.Windows.Forms.TextBox
$ConceptLabelJaBox.Location = New-Object System.Drawing.Point(480, 34)
$ConceptLabelJaBox.Size = New-Object System.Drawing.Size(250, 24)
$ConceptEditorPanel.Controls.Add($ConceptLabelJaBox)

$ConceptLabelEnLabel = New-Object System.Windows.Forms.Label
$ConceptLabelEnLabel.Text = "表示名 英語"
$ConceptLabelEnLabel.Location = New-Object System.Drawing.Point(750, 37)
$ConceptLabelEnLabel.Size = New-Object System.Drawing.Size(80, 22)
$ConceptEditorPanel.Controls.Add($ConceptLabelEnLabel)

$ConceptLabelEnBox = New-Object System.Windows.Forms.TextBox
$ConceptLabelEnBox.Location = New-Object System.Drawing.Point(835, 34)
$ConceptLabelEnBox.Size = New-Object System.Drawing.Size(310, 24)
$ConceptEditorPanel.Controls.Add($ConceptLabelEnBox)

$ConceptFeatureLabel = New-Object System.Windows.Forms.Label
$ConceptFeatureLabel.Text = "feature"
$ConceptFeatureLabel.Location = New-Object System.Drawing.Point(390, 69)
$ConceptFeatureLabel.Size = New-Object System.Drawing.Size(90, 22)
$ConceptEditorPanel.Controls.Add($ConceptFeatureLabel)

$ConceptFeatureBox = New-Object System.Windows.Forms.TextBox
$ConceptFeatureBox.Location = New-Object System.Drawing.Point(480, 66)
$ConceptFeatureBox.Size = New-Object System.Drawing.Size(250, 24)
$ConceptEditorPanel.Controls.Add($ConceptFeatureBox)

$ConceptModalitiesLabel = New-Object System.Windows.Forms.Label
$ConceptModalitiesLabel.Text = "modality"
$ConceptModalitiesLabel.Location = New-Object System.Drawing.Point(750, 69)
$ConceptModalitiesLabel.Size = New-Object System.Drawing.Size(80, 22)
$ConceptEditorPanel.Controls.Add($ConceptModalitiesLabel)

$ConceptModalitiesBox = New-Object System.Windows.Forms.TextBox
$ConceptModalitiesBox.Location = New-Object System.Drawing.Point(835, 66)
$ConceptModalitiesBox.Size = New-Object System.Drawing.Size(310, 24)
$ConceptEditorPanel.Controls.Add($ConceptModalitiesBox)

$ConceptAcquisitionsLabel = New-Object System.Windows.Forms.Label
$ConceptAcquisitionsLabel.Text = "sequence"
$ConceptAcquisitionsLabel.Location = New-Object System.Drawing.Point(390, 101)
$ConceptAcquisitionsLabel.Size = New-Object System.Drawing.Size(90, 22)
$ConceptEditorPanel.Controls.Add($ConceptAcquisitionsLabel)

$ConceptAcquisitionsBox = New-Object System.Windows.Forms.TextBox
$ConceptAcquisitionsBox.Location = New-Object System.Drawing.Point(480, 98)
$ConceptAcquisitionsBox.Size = New-Object System.Drawing.Size(665, 24)
$ConceptEditorPanel.Controls.Add($ConceptAcquisitionsBox)

$ConceptSynonymsJaLabel = New-Object System.Windows.Forms.Label
$ConceptSynonymsJaLabel.Text = "同義語 日本語"
$ConceptSynonymsJaLabel.Location = New-Object System.Drawing.Point(390, 133)
$ConceptSynonymsJaLabel.Size = New-Object System.Drawing.Size(90, 22)
$ConceptEditorPanel.Controls.Add($ConceptSynonymsJaLabel)

$ConceptSynonymsJaBox = New-Object System.Windows.Forms.TextBox
$ConceptSynonymsJaBox.Location = New-Object System.Drawing.Point(480, 130)
$ConceptSynonymsJaBox.Size = New-Object System.Drawing.Size(300, 76)
$ConceptSynonymsJaBox.Multiline = $true
$ConceptSynonymsJaBox.ScrollBars = "Vertical"
$ConceptEditorPanel.Controls.Add($ConceptSynonymsJaBox)

$ConceptSynonymsEnLabel = New-Object System.Windows.Forms.Label
$ConceptSynonymsEnLabel.Text = "同義語 英語"
$ConceptSynonymsEnLabel.Location = New-Object System.Drawing.Point(800, 133)
$ConceptSynonymsEnLabel.Size = New-Object System.Drawing.Size(90, 22)
$ConceptEditorPanel.Controls.Add($ConceptSynonymsEnLabel)

$ConceptSynonymsEnBox = New-Object System.Windows.Forms.TextBox
$ConceptSynonymsEnBox.Location = New-Object System.Drawing.Point(890, 130)
$ConceptSynonymsEnBox.Size = New-Object System.Drawing.Size(255, 76)
$ConceptSynonymsEnBox.Multiline = $true
$ConceptSynonymsEnBox.ScrollBars = "Vertical"
$ConceptEditorPanel.Controls.Add($ConceptSynonymsEnBox)

$ConceptTokensLabel = New-Object System.Windows.Forms.Label
$ConceptTokensLabel.Text = "tokens"
$ConceptTokensLabel.Location = New-Object System.Drawing.Point(390, 221)
$ConceptTokensLabel.Size = New-Object System.Drawing.Size(90, 22)
$ConceptEditorPanel.Controls.Add($ConceptTokensLabel)

$ConceptTokensBox = New-Object System.Windows.Forms.TextBox
$ConceptTokensBox.Location = New-Object System.Drawing.Point(480, 218)
$ConceptTokensBox.Size = New-Object System.Drawing.Size(665, 48)
$ConceptTokensBox.Multiline = $true
$ConceptEditorPanel.Controls.Add($ConceptTokensBox)

$ConceptOppositesLabel = New-Object System.Windows.Forms.Label
$ConceptOppositesLabel.Text = "反対所見"
$ConceptOppositesLabel.Location = New-Object System.Drawing.Point(390, 281)
$ConceptOppositesLabel.Size = New-Object System.Drawing.Size(90, 22)
$ConceptEditorPanel.Controls.Add($ConceptOppositesLabel)

$ConceptOppositesBox = New-Object System.Windows.Forms.TextBox
$ConceptOppositesBox.Location = New-Object System.Drawing.Point(480, 278)
$ConceptOppositesBox.Size = New-Object System.Drawing.Size(665, 48)
$ConceptOppositesBox.Multiline = $true
$ConceptEditorPanel.Controls.Add($ConceptOppositesBox)

$DictionaryRawPanel = New-Object System.Windows.Forms.Panel
$DictionaryRawPanel.Location = New-Object System.Drawing.Point(10, 116)
$DictionaryRawPanel.Size = New-Object System.Drawing.Size(1180, 360)
$DictionaryRawPanel.Visible = $false
$ManualTab.Controls.Add($DictionaryRawPanel)

$DictionaryFileEditor = New-Object System.Windows.Forms.TextBox
$DictionaryFileEditor.Multiline = $true
$DictionaryFileEditor.ScrollBars = "Both"
$DictionaryFileEditor.Font = New-Object System.Drawing.Font("Consolas", 9)
$DictionaryFileEditor.Location = New-Object System.Drawing.Point(0, 0)
$DictionaryFileEditor.Size = New-Object System.Drawing.Size(1180, 360)
$DictionaryRawPanel.Controls.Add($DictionaryFileEditor)

$ExportHelpTop = New-Object System.Windows.Forms.Label
$ExportHelpTop.Text = "PCで作成した検索データをiPhoneへ渡すための JSON pack を作成します。OneDriveフォルダを指定すると自動コピーします。"
$ExportHelpTop.Location = New-Object System.Drawing.Point(15, 20)
$ExportHelpTop.Size = New-Object System.Drawing.Size(1050, 24)
$ExportTab.Controls.Add($ExportHelpTop)

$OneDriveLabel = New-Object System.Windows.Forms.Label
$OneDriveLabel.Text = "コピー先 OneDrive フォルダ"
$OneDriveLabel.Location = New-Object System.Drawing.Point(15, 58)
$OneDriveLabel.Size = New-Object System.Drawing.Size(200, 24)
$ExportTab.Controls.Add($OneDriveLabel)

$OneDriveBox = New-Object System.Windows.Forms.TextBox
$OneDriveBox.Location = New-Object System.Drawing.Point(15, 85)
$OneDriveBox.Size = New-Object System.Drawing.Size(820, 24)
$ExportTab.Controls.Add($OneDriveBox)

$BrowseButton = New-Object System.Windows.Forms.Button
$BrowseButton.Text = "選択"
$BrowseButton.Location = New-Object System.Drawing.Point(845, 83)
$BrowseButton.Size = New-Object System.Drawing.Size(100, 28)
$ExportTab.Controls.Add($BrowseButton)

$ExportButton = New-Object System.Windows.Forms.Button
$ExportButton.Text = "JSON packを作成してコピー"
$ExportButton.Location = New-Object System.Drawing.Point(15, 165)
$ExportButton.Size = New-Object System.Drawing.Size(190, 34)
$ExportTab.Controls.Add($ExportButton)

$BackupButton = New-Object System.Windows.Forms.Button
$BackupButton.Text = "バックアップ作成"
$BackupButton.Location = New-Object System.Drawing.Point(15, 125)
$BackupButton.Size = New-Object System.Drawing.Size(150, 34)
$ExportTab.Controls.Add($BackupButton)

$DoctorButton = New-Object System.Windows.Forms.Button
$DoctorButton.Text = "全体点検"
$DoctorButton.Location = New-Object System.Drawing.Point(175, 125)
$DoctorButton.Size = New-Object System.Drawing.Size(120, 34)
$ExportTab.Controls.Add($DoctorButton)

$ExportHelp = New-Object System.Windows.Forms.Label
$ExportHelp.Text = "空欄のまま実行すると、ローカルの exports\mobile\radiology-ddx-pack.json だけを作成します。"
$ExportHelp.Location = New-Object System.Drawing.Point(15, 215)
$ExportHelp.Size = New-Object System.Drawing.Size(950, 24)
$ExportTab.Controls.Add($ExportHelp)

$ExportResultLabel = New-Object System.Windows.Forms.Label
$ExportResultLabel.Text = "未実行"
$ExportResultLabel.Location = New-Object System.Drawing.Point(15, 245)
$ExportResultLabel.Size = New-Object System.Drawing.Size(1050, 24)
$ExportTab.Controls.Add($ExportResultLabel)

$script:LogBox = New-Object System.Windows.Forms.TextBox
$script:LogBox.Multiline = $true
$script:LogBox.ScrollBars = "Vertical"
$script:LogBox.Font = New-Object System.Drawing.Font("Consolas", 9)
$script:LogBox.Location = New-Object System.Drawing.Point(12, 610)
$script:LogBox.Size = New-Object System.Drawing.Size(1240, 150)
$script:LogBox.Anchor = "Top,Left,Right,Bottom"
$Form.Controls.Add($script:LogBox)

$script:BusyButtons = @(
  $CardSaveButton,
  $ApproveDraftButton,
  $CardReloadButton,
  $CardDeleteButton,
  $MaintenanceButton,
  $BuildIndexButton,
  $ApplyRawFindingButton,
  $LoadDictionaryButton,
  $SaveDictionaryButton,
  $SaveConceptButton,
  $BrowseButton,
  $BackupButton,
  $DoctorButton,
  $ExportButton
)

$CardFilterBox.Add_TextChanged({ Refresh-CardList })
$ShowDraftOnlyCheck.Add_CheckedChanged({ Refresh-CardList })
$CardList.Add_SelectedIndexChanged({ Show-SelectedCard })
$FindingGrid.Add_SelectionChanged({ Show-SelectedFinding })
$RawFindingGrid.Add_SelectionChanged({ Show-SelectedRawFinding })
$ApplyFindingButton.Add_Click({
  Invoke-GuiAction {
    Apply-FindingForm
    Write-Log "画像所見をフォーム内に反映しました。保存ボタンでJSONに書き込みます。"
  }
})
$ApplyRawFindingButton.Add_Click({
  Invoke-GuiAction {
    Apply-RawFindingForm
    Write-Log "自由記載所見をフォーム内に反映しました。保存ボタンでJSONに書き込みます。"
  }
})
$CardSaveButton.Add_Click({ Invoke-GuiAction { Save-SelectedCard } })
$ApproveDraftButton.Add_Click({ Invoke-GuiAction { Approve-SelectedDraft } })
$CardReloadButton.Add_Click({ Invoke-GuiAction { Refresh-All } })
$CardDeleteButton.Add_Click({ Invoke-GuiAction { Delete-SelectedCard } })
$CardRawToggleButton.Add_Click({
  if ($CardEditor.Visible) {
    Set-CardRawVisible $false
  } else {
    if ($script:SelectedCard) { $CardEditor.Text = Read-Text $script:SelectedCard.FilePath }
    Set-CardRawVisible $true
  }
})

$MaintenanceButton.Add_Click({ Invoke-GuiAction { Run-Maintenance } })
$BuildIndexButton.Add_Click({ Invoke-GuiAction { Run-BuildIndex } })
$DictionaryFileCombo.Add_SelectedIndexChanged({ Load-SelectedDictionaryFile })
$LoadDictionaryButton.Add_Click({ Invoke-GuiAction { Load-SelectedDictionaryFile } })
$SaveDictionaryButton.Add_Click({ Invoke-GuiAction { Save-SelectedDictionaryFile } })
$DictionaryRawToggleButton.Add_Click({ Set-DictionaryRawVisible (!$DictionaryRawPanel.Visible) })
$ConceptFilterBox.Add_TextChanged({ Refresh-ConceptList })
$ConceptList.Add_SelectedIndexChanged({ Show-SelectedConcept })
$SaveConceptButton.Add_Click({ Invoke-GuiAction { Save-SelectedConcept } })

$BrowseButton.Add_Click({ Select-OneDriveFolder })
$BackupButton.Add_Click({ Invoke-GuiAction { Backup-Data } })
$DoctorButton.Add_Click({ Invoke-GuiAction { Run-Doctor } })
$ExportButton.Add_Click({ Invoke-GuiAction { Export-Mobile } })

Refresh-All
Write-Log "Ready. Root: $script:Root"
if ($SmokeTest) {
  if ($script:CardItems.Count -gt 0) {
    $firstDraft = $script:CardItems | Where-Object { $_.Source -eq "draft" } | Select-Object -First 1
    if ($firstDraft -and !$firstDraft.DiseaseId) {
      throw "SmokeTest failed: first draft has empty disease_id"
    }
    if ($firstDraft) {
      $ShowDraftOnlyCheck.Checked = $true
      Refresh-CardList
      $CardList.SelectedIndex = 0
      $selected = Get-SelectedCard
      if (!$selected -or !$selected.DiseaseId) {
        throw "SmokeTest failed: selected draft disease_id was not recovered"
      }
      Write-Log "Smoke selected disease_id=$($selected.DiseaseId)"
    }
  }
  Invoke-NodeScript "apps\pc-admin\pc-admin.js" @("status")
  if ($DictionaryFileCombo.Items.Contains("finding-concepts.json")) {
    $DictionaryFileCombo.SelectedItem = "finding-concepts.json"
    Load-SelectedDictionaryFile
    Set-DictionaryRawVisible $true
    if ($DictionaryRawToggleButton.Text -ne "JSON原文を閉じる") {
      throw "SmokeTest failed: dictionary raw editor did not open"
    }
    Set-DictionaryRawVisible $false
    if ($DictionaryRawToggleButton.Text -ne "JSON原文を開く") {
      throw "SmokeTest failed: dictionary raw editor did not close"
    }
  }
  Write-Output "pc-admin-gui smoke ok"
  return
}
if ($SmokeExport) {
  $OneDriveBox.Text = Join-Path ([System.IO.Path]::GetTempPath()) "mobile-pack-gui-export-test"
  Export-Mobile
  Write-Output "pc-admin-gui export smoke ok"
  return
}
[void]$Form.ShowDialog()
