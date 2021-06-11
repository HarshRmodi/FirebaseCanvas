import { Component, Inject, ViewChild } from '@angular/core';
import { AuthService } from 'src/app/shared/auth.service';
import { EventHandlerService } from '../event-handler.service';
import { FabricCanvasComponent } from '../fabric-canvas/fabric-canvas.component';
import { DrawingTools } from '../models';

@Component({
  selector: 'app-graphical-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss'],
})
export class GraphicalToolbarComponent {
  DrawingTools = DrawingTools;
  selected = this.fabricService.selectedTool;
  url = "";

  constructor(private fabricService: EventHandlerService,
    public authService: AuthService,
  ) { }

  async select(tool: DrawingTools) {
    this.fabricService.selectedTool = tool;
    this.selected = this.fabricService.selectedTool;
  }

  public addImageOnCanvas(url) {
    this.authService.urlSubjectValue(url);

  }

  public readUrl(event) {
    if (event.target.files && event.target.files[0] && event.target.files[0].size < 1000000 && event.target.files[0].type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (readerEvent: any) => {
        this.url = readerEvent.target.result;
      };
      reader.readAsDataURL(event.target.files[0]);
    }
  }

  public removeWhite(url) {
    this.url = ""
  }
}
