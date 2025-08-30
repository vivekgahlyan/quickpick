import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild, SecurityContext } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-note-editor',
  imports: [CommonModule],
  templateUrl: './note-editor.component.html',
  styleUrls: ['./note-editor.component.css']
})
export class NoteEditorComponent {
  @ViewChild('noteContent') noteContentRef!: ElementRef<HTMLDivElement>;
  @ViewChild('aiOutputSection') aiOutputSectionRef!: ElementRef<HTMLDivElement>;

  // Component state properties
  charCount = 0;
  readonly MAX_CHARS = 2000;
  aiOutputContent: SafeHtml = '';
  isAiOutputVisible = false;

  // Properties for the notification toast
  isMessageBoxVisible = false;
  messageBoxText = '';
  private messageTimeout: any;

  placeholderText = 'Start typing your notes here...';
  noteEmpty = true;

  constructor(private sanitizer: DomSanitizer) { }

  applyFormat(command: string): void {
    document.execCommand(command, false, undefined);
    this.noteContentRef.nativeElement.focus();
  }

  // ensure caret is placed at the end of the contenteditable element
  placeCaretAtEnd(): void {
    const el = this.noteContentRef?.nativeElement;
    if (!el) { return; }

    el.focus();

    // create a range that collapses to the end
    const range = document.createRange();
    range.selectNodeContents(el);
    range.collapse(false);

    const sel = window.getSelection();
    if (!sel) { return; }
    sel.removeAllRanges();
    sel.addRange(range);
  }

  // called from (focus) in template — keep caret placement non-disruptive
  onEditorFocus(): void {
    const el = this.noteContentRef?.nativeElement;
    if (!el) { return; }

    // remove zero-width characters that break empty detection
    el.innerHTML = el.innerHTML.replace(/\u200B/g, '');

    // update char count / empty state
    this.onNoteChange();

    // only force caret at end when editor is empty to avoid jumping while editing
    if (this.noteEmpty) {
      // ensure a text node exists so range.selectNodeContents works reliably
      if (el.childNodes.length === 0) {
        el.appendChild(document.createTextNode(''));
      }
      this.placeCaretAtEnd();
    }
  }

  onNoteChange(): void {
    const element = this.noteContentRef.nativeElement;

    // Remove zero-width and other invisible chars that break :empty detection
    element.innerHTML = element.innerHTML.replace(/\u200B/g, '');

    // Use innerText for visible length and trimming
    let visibleText = element.innerText.replace(/\u00A0/g, ''); // strip &nbsp;
    visibleText = visibleText.replace(/\s+$/g, ''); // trim trailing whitespace for accurate length

    if (visibleText.length === 0) {
      // remove any browser-inserted <br> or invisible markup so :empty works
      element.innerHTML = '';
      this.charCount = 0;
      this.noteEmpty = true;
      return;
    }

    // enforce max chars using visibleText but keep formatting by trimming nodes if needed
    if (visibleText.length > this.MAX_CHARS) {
      // truncate visible content and set as plain text to avoid broken markup
      const truncated = visibleText.slice(0, this.MAX_CHARS);
      element.textContent = truncated;
      this.charCount = this.MAX_CHARS;

      // caret may move after programmatic text set — put it at the end
      this.placeCaretAtEnd();
    } else {
      this.charCount = visibleText.length;
    }

    this.noteEmpty = false;
  }

  // new: clear the editable content and reset related state
  clearAll(): void {
    if (this.noteContentRef && this.noteContentRef.nativeElement) {
      // clear completely (removes <br> and &nbsp;)
      this.noteContentRef.nativeElement.innerHTML = '';
      this.noteContentRef.nativeElement.textContent = '';
    }
    this.charCount = 0;
    this.noteEmpty = true;
    this.isAiOutputVisible = false;
    this.aiOutputContent = this.sanitizer.bypassSecurityTrustHtml('');
    // focus & put caret at end (safe when empty)
    this.onEditorFocus();
    this.showMessage('All notes cleared.');
  }

  reorganizeNotes(): void {

    const rawText = this.noteContentRef.nativeElement.innerText;
    if (rawText.trim() === '') {
      this.showMessage('Please write some notes first!');
      return;
    }

    // Simulate an organized response from an AI
    //const topics = rawText.split('\n').filter(line => line.trim() !== '').slice(0, 3);
    //const topicList = topics.map(topic => `<li>${this.sanitizer.sanitize(SecurityContext.HTML, topic)}</li>`).join('');

    const organizedHtml = `
      <p>This is an AI response.</p>
      <hr>
      <p class="small text-muted fst-italic">Please review and edit as needed.</p>
    `;

    // Use DomSanitizer to trust the generated HTML
    this.aiOutputContent = this.sanitizer.bypassSecurityTrustHtml(organizedHtml);
    this.isAiOutputVisible = true;

    // Scroll to the AI output section after the view updates
    setTimeout(() => {
      this.aiOutputSectionRef.nativeElement.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  }

  /**
   * Copies the innerText of the AI output to the clipboard.
   */
  async copyOutput(): Promise<void> {
    const aiOutputDiv = document.createElement('div');
    aiOutputDiv.innerHTML = this.aiOutputContent.toString();
    const textToCopy = aiOutputDiv.innerText;

    if (navigator.clipboard) {
      try {
        await navigator.clipboard.writeText(textToCopy);
        this.showMessage('Text copied to clipboard!');
      } catch (err) {
        this.showMessage('Failed to copy text.');
        console.error('Could not copy text: ', err);
      }
    }
  }

  /**
   * Discard the AI output section, clear trusted HTML and focus back to the editor.
   */
  discardAiOutput(): void {
    this.isAiOutputVisible = false;
    this.aiOutputContent = this.sanitizer.bypassSecurityTrustHtml('');
    // ensure editor is focused and caret at end
    this.placeCaretAtEnd();
    this.onNoteChange();
    this.showMessage('AI output discarded.');
  }

  private showMessage(text: string): void {
    this.messageBoxText = text;
    this.isMessageBoxVisible = true;

    // Clear any existing timeout to avoid overlaps
    clearTimeout(this.messageTimeout);

    this.messageTimeout = setTimeout(() => {
      this.isMessageBoxVisible = false;
    }, 2500);
  }
}