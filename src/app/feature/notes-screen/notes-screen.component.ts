import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-notes-screen',
  imports: [CommonModule],
  templateUrl: './notes-screen.component.html',
  styleUrl: './notes-screen.component.css'
})
export class NotesScreenComponent {

  note: string = '';
  charCount: number = 0;
  maxChars = 2500;
  reorganizedText: string = '';
  isLoading = false;
  copied = false;
  message: { text: string; type: string } | null = null;

  checkLength() {
    this.charCount = this.note.length;
    if (this.charCount > this.maxChars) {
      this.note = this.note.slice(0, this.maxChars);
    }
  }

  formatText(command: string) {
    document.execCommand(command, false, '');
  }

  async reorganizeNotes() {
    if (!this.note.trim()) {
      this.showMessage('Please enter some notes to re-organize.', 'warning');
      return;
    }
    this.isLoading = true;
    this.reorganizedText = '';
    setTimeout(() => {
      this.reorganizedText = `**Reorganized Notes:**\n\n1. Summary: ${this.note.slice(0, 50)}...`;
      this.isLoading = false;
    }, 2000);
  }

  copyText() {
    navigator.clipboard.writeText(this.reorganizedText).then(() => {
      this.copied = true;
      setTimeout(() => (this.copied = false), 2000);
    });
  }

  saveNote() {
    if (!this.note.trim()) {
      this.showMessage('Please enter some text to save.', 'warning');
      return;
    }
    // Replace with Firebase service call
    console.log('Saving note:', this.note);
    this.showMessage('Note saved successfully!', 'success');
  }

  showMessage(text: string, type: string) {
    this.message = { text, type };
    setTimeout(() => (this.message = null), 3000);
  }
}
