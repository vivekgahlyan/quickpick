import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { FormsModule } from '@angular/forms';
import { TypingEffectDirective } from './typing-effect.directive';
import { MarkdownComponent } from 'ngx-markdown';
import { CommonService } from '../../core/services/common/common.service';

const genAI = new GoogleGenerativeAI('AIzaSyDJLT3-o-pgaBJtAl_T2LgW3WAh5RN0nwk');
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

@Component({
  selector: 'app-notes-screen',
  imports: [CommonModule, FormsModule,],
  templateUrl: './notes-screen.component.html',
  styleUrl: './notes-screen.component.css'
})
export class NotesScreenComponent implements OnInit{

  commonService = inject(CommonService);
  note: string = '';
  charCount: number = 0;
  maxChars = 2500;
  reorganizedText: string = '';
  isLoading = false;
  copied = false;
  message: { text: string; type: string } | null = null;
  username: string = '';
  quickpickResponse = {notes: ""};

  NotesScreenComponent() {
    this.username = sessionStorage.getItem('username') || '';
  }

   ngOnInit(): void {

     this.username = sessionStorage.getItem('username') || '';

     setTimeout(() => {
       this.commonService.getUserNotes(this.username).subscribe(response => {
         console.log(response);
         this.note = response.notes;
       });
     }, 500);
   }

  checkLength() {
    this.charCount = this.note.length;
    if (this.charCount > this.maxChars) {
      this.note = this.note.slice(0, this.maxChars);
    }
  }

  async reorganizeNotes() {
    if (!this.note.trim()) {
      this.showMessage('Please enter some notes to re-organize.', 'warning');
      return;
    }

    console.log('Notes:', this.note);
    this.isLoading = true;

    setTimeout(async () => {

      const prompt = `Reorganize the following notes into clear, concise bullet points:\n\n${this.note}\n\nBullet Points:`;
      const result = await model.generateContent([prompt]);
      this.reorganizedText = result.response.text();
      console.log('Reorganized Text:', this.reorganizedText);
      this.isLoading = false;
    }, 500);
  }

  organizeWithInsights() {
    if (this.reorganizedText.trim()) {

      setTimeout(async () => {
        this.isLoading = true;
        const insightsPrompt = `Based on the following notes, provide key insights and action items:\n\n${this.reorganizedText}\n\nInsights and Action Items:`;
        const result = await model.generateContent([insightsPrompt]);
        this.reorganizedText = result.response.text();
        this.isLoading = false;
      }, 500);
    }
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
    
    this.commonService.saveUserNote(this.username, this.note).subscribe(response => {
      console.log('Saving note:', response);
    })
    this.showMessage('Note saved successfully!', 'success');
  }

  showMessage(text: string, type: string) {
    this.message = { text, type };
    setTimeout(() => (this.message = null), 3000);
  }

  onTypingUpdate(typed: string) {
    this.reorganizedText = typed;
  }
}
