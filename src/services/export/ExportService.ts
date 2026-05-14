export type ExportFormat = 'txt' | 'pdf' | 'docx';

export interface ExportOptions {
  includeTimestamps: boolean;
  includeSpeakerLabels: boolean;
}

export class ExportService {
  /**
   * Generates a plain text representation of the transcript.
   */
  static toTxt(transcript: string, options: ExportOptions): string {
    // In the future, this would iterate through segments with timestamps
    return transcript;
  }

  /**
   * Triggers a browser download of the generated file.
   */
  static downloadFile(content: string, filename: string, mimeType: string) {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
}
