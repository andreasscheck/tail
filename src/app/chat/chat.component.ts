import { Message } from '../model/message';
import { BackendService } from '../services/backend.service';
import { SettingsService } from '../services/settings.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent {
  public messages: Message[] = [];
  public messageText: String;
  constructor(private backend: BackendService) {
    backend.subscribeChat().subscribe((message: Message) => {
      if (message) {
        this.messages.push(message);
      }
    });
  }

  public sendMessage() {
    this.backend.sendChatMessage(this.messageText);
        this.messageText = '';
  }
}
