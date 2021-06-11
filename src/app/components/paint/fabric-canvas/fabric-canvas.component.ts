import { AfterContentInit, AfterViewInit, Component, Input, NgZone, OnInit } from '@angular/core';
import { fabric } from 'fabric';
import { AuthService } from '../../../../app/shared/auth.service';
import { EventHandlerService } from '../event-handler.service';
import { CustomFabricObject } from '../models';

@Component({
  selector: 'app-fabric-canvas',
  templateUrl: './fabric-canvas.component.html',
  styleUrls: ['./fabric-canvas.component.scss'],
})
export class FabricCanvasComponent implements AfterContentInit, AfterViewInit, OnInit {
  canvas: fabric.Canvas;
  public url: string | ArrayBuffer = '';
  loading: boolean = false;
  @Input() set imageDataURL(v: string) {
    if (v) {
      this.eventHandler.imageDataUrl = v;
    }
  }

  constructor(private eventHandler: EventHandlerService, private ngZone: NgZone, private _authService: AuthService) { }

  ngOnInit() {
    this.loading = true;
    this.loadCanvasToJSON();
  }

  ngAfterContentInit() {
    this.ngZone.runOutsideAngular(() => {
      if (this.eventHandler.canvas) {
        this.eventHandler.canvas.dispose();
      }
      this.canvas = new fabric.Canvas('canvas', {
        selection: false,
        preserveObjectStacking: true,
      });
      this.eventHandler.canvas = this.canvas;
      this.eventHandler.extendToObjectWithId();
      fabric.Object.prototype.objectCaching = false;
      this.addEventListeners();
    });

    this._authService.urlSubject.subscribe(res => {
      this.url = res;
      if (this.url) {
        this.addImageOnCanvas(this.url);
      }
    });
  }

  ngAfterViewInit() {
    this.eventHandler.addBGImageSrcToCanvas();
  }

  private addEventListeners() {
    this.canvas.on('mouse:down', e => this.ngZone.run(() => {
      this.onCanvasMouseDown(e);
      // this.saveCanvasToJSON();

    }
    ));
    this.canvas.on('mouse:move', e => this.ngZone.run(() => {
      this.onCanvasMouseMove(e);
      // this.saveCanvasToJSON();

    }));
    this.canvas.on('mouse:up', () => this.ngZone.run(() => {
      this.onCanvasMouseUp();
      this.saveCanvasToJSON();

    }
    ));
    this.canvas.on('selection:created', e => this.ngZone.run(() => {
      this.onSelectionCreated(e as any);
      // this.saveCanvasToJSON();

    }));
    this.canvas.on('selection:updated', e => this.ngZone.run(() => {
      this.onSelectionUpdated(e as any);
      // this.saveCanvasToJSON();

    }));
    this.canvas.on('object:moving', e => this.ngZone.run(() => {
      this.onObjectMoving(e as any);
      // this.saveCanvasToJSON();
    }
    ));
    this.canvas.on('object:scaling', e => this.ngZone.run(() => {
      this.onObjectScaling(e as any);
      this.saveCanvasToJSON();

    }));
  }

  private onCanvasMouseDown(event: { e: Event }) {
    this.eventHandler.mouseDown(event.e);
    this.avoidDragAndClickEventsOfOtherUILibs(event.e);
    // this.saveCanvasToJSON();

  }
  private onCanvasMouseMove(event: { e: Event }) {
    this.eventHandler.mouseMove(event.e);
  }
  private onCanvasMouseUp() {
    this.eventHandler.mouseUp();
  }
  private onSelectionCreated(e: { target: CustomFabricObject }) {
    this.eventHandler.objectSelected(e.target);
  }
  private onSelectionUpdated(e: { target: CustomFabricObject }) {
    this.eventHandler.objectSelected(e.target);
  }
  private onObjectMoving(e: any) {
    this.eventHandler.objectMoving(e.target.id, e.target.type, e.target.left, e.target.top);
  }
  private onObjectScaling(e: any) {
    this.eventHandler.objectScaling(
      e.target.id,
      e.target.type,
      { x: e.target.scaleX, y: e.target.scaleY },
      { left: e.target.left, top: e.target.top },
    );
  }

  private avoidDragAndClickEventsOfOtherUILibs(e: Event) {
    e.stopPropagation();
  }

  saveCanvasToJSON() {
    this.loading = true;
    const json = JSON.stringify(this.canvas);
    localStorage.setItem('Kanvas', json);
    let docRef: any = this._authService.fetchRecord(JSON.parse(localStorage.getItem('currentUser')).user.uid);
    docRef.get().subscribe((doc) => {
      if (doc.exists) {
        this.updateRecord();
      } else {
        this.CreateRecord();
      }
    })

  }

  loadCanvasToJSON() {

    let docRef: any = this._authService.fetchRecord(JSON.parse(localStorage.getItem('currentUser')).user.uid);
    docRef.get().subscribe((doc) => {
      this.loading = false;

      // const CANVAS = localStorage.getItem('Kanvas');
      if (doc.exists) {
        const CANVAS = doc.data().JsonString;
        // and load everything from the same json
        this.canvas.loadFromJSON(CANVAS, () => {

          this.canvas.renderAll();
          this.loading = false;

        });
      }
    });

  }



  CreateRecord() {
    let record = {};
    record['Id'] = JSON.parse(localStorage.getItem('currentUser')).user.uid;
    record['JsonString'] = localStorage.getItem('Kanvas');
    this._authService.create_NewRecord(record).then(resp => {
      this.loading = false;

    })
      .catch(error => {
        console.log(error);
      });
  }

  updateRecord() {
    let record = {};
    record['Id'] = JSON.parse(localStorage.getItem('currentUser')).user.uid;
    record['JsonString'] = localStorage.getItem('Kanvas');
    this._authService.update_Record(record['Id'], record).then(resp => {
      this.loading = false;

    })
      .catch(error => {
        console.log(error);
      });
  }

  public addImageOnCanvas(url) {
    console.log(this.canvas);
    fabric.Image.fromURL(url, (image) => {
      image.set({
        left: 10,
        top: 10,
        angle: 0,
        padding: 10,
        cornerSize: 10,
        hasRotatingPoint: true
      });
      image.scaleToWidth(200);
      image.scaleToHeight(200);
      this.extend(image, this.randomId());
      this.canvas.add(image);
      this.selectItemAfterAdded(image);
    });
  }

  extend(obj, id) {
    obj.toObject = ((toObject) => {
      return function () {
        return fabric.util.object.extend(toObject.call(this), {
          id
        });
      };
    })(obj.toObject);
  }

  randomId() {
    return Math.floor(Math.random() * 999999) + 1;
  }

  selectItemAfterAdded(obj) {
    this.canvas.discardActiveObject().renderAll();
    this.canvas.setActiveObject(obj);
  }
}
