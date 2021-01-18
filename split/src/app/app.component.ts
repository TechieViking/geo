import { AfterViewInit, Component, ViewEncapsulation } from "@angular/core";
import * as L from "leaflet";
import * as createjs from 'createjs-module';
import $ from "jquery";
import { fabric } from "fabric";
@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
  encapsulation: ViewEncapsulation.None
})
export class AppComponent implements AfterViewInit {
  mapStack = [];
  mapListArray = [
    {
      "mapId": "map1",
      "ObjectID": 1,
      "titleLayerUrl": "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      "properties": {
        "minZoom": 5,
        "maxZoom": 20,
        "center": [22.57, 88.36],
        "zoom": 10,
        "zoomControl": true
      }
    },
    {
      "mapId": "map2",
      "ObjectID": 2,
      "titleLayerUrl": "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      "properties": {
        "minZoom": 5,
        "maxZoom": 20,
        "center": [22.57, 88.36],
        "zoom": 10,
        "zoomControl": true
      }
    },
    {
      "mapId": "map3",
      "ObjectID": 3,
      "titleLayerUrl": "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      "properties": {
        "minZoom": 5,
        "maxZoom": 20,
        "center": [22.57, 88.36],
        "zoom": 10,
        "zoomControl": true
      }
    },

  ];
  mapSlotArray = [];
  ngAfterViewInit() {

    this.init();
    //this.syncMaps();
    console.log(canvasLibraryLeaflet());
  }

  init() {
    this.setMapLayer();
  }
  setMapLayer() {
    let screenWidth = window.innerWidth;
    let slotWidth = screenWidth / 3;
    for (let i = 0; i <= this.mapListArray.length - 1; i++) {
      let element = document.createElement("div");
      let canvasElm = document.createElement("canvas");
      canvasElm.setAttribute("id", "canvas" + i);
      element.setAttribute("id", this.mapListArray[i].mapId);
      element.setAttribute("class", "mapcss")
      element.appendChild(canvasElm);
      var parent = document.getElementsByTagName("app-root")[0].getElementsByClassName("maps-wrapper")[0]
      parent.appendChild(element);

      let mapObject = L.map(this.mapListArray[i].mapId, {
        zoomControl: true
      }).setView(this.mapListArray[i].properties.center, this.mapListArray[i].properties.zoom);

      let canvasHeight = document.getElementsByTagName("canvas")[i].parentNode.clientHeight;
      document.getElementsByTagName("canvas")[i].style.width = slotWidth + "px";
      document.getElementsByTagName("canvas")[i].style.height = canvasHeight + "px";
      this.drawGrid(canvasElm);

      // new createVirtualGrid().virtualGrid({
      //   cellSize: 50
      // }).addTo(mapObject);
      // console.log(mapObject);



      this.mapSlotArray.push(mapObject);

    }
    this.setTiles();
  }
  setTiles() {
    //let slotWidth = document.querySelector('.maps-wrapper').clientWidth / 3
    //let slotHeight = document.querySelector('.maps-wrapper').clientHeight;
    for (let i = 0; i <= this.mapListArray.length - 1; i++) {
      L.tileLayer(this.mapListArray[i].titleLayerUrl, {
      }).addTo(this.mapSlotArray[i]);
      this.mapSlotArray[i].invalidateSize(true);

      //var slotWidth = document.getElementsByClassName("mapcss")[i].clientWidth;
      //var slotHeight = document.getElementsByClassName("mapcss")[i].clientHeight;

    }
    //document.querySelector("canvas").style.width = slotWidth + "px";
    //document.querySelector("canvas").style.height = slotHeight + "px";
    this.syncMaps()

  }
  syncMaps() {
    this.mapSlotArray[0].sync(this.mapSlotArray[1], true)
    this.mapSlotArray[0].sync(this.mapSlotArray[2], true)

    this.mapSlotArray[1].sync(this.mapSlotArray[0], true)
    this.mapSlotArray[1].sync(this.mapSlotArray[2], true)

    this.mapSlotArray[2].sync(this.mapSlotArray[0], true)
    this.mapSlotArray[2].sync(this.mapSlotArray[1], true)

  }
  drawGrid(element) {
    console.log('id', element)
    let canvasID = element.id;
    // console.log(element.clientWidth)
    // //var canvas = document.querySelector("myCanvas");

    let screenWidth = window.innerWidth;
    let slotWidth = screenWidth / 3;

    var canvas = new fabric.Canvas(canvasID);
    var grid = 50;
    var unitScale = 10;
    var canvasWidth = slotWidth;
    var canvasHeight = window.innerHeight;
    let gridData = [

    ]
    canvas.setWidth(canvasWidth);
    canvas.setHeight(canvasHeight);
    console.log(canvasWidth, canvasHeight)
    for (var i = 0; i < (900 / grid); i++) {
      canvas.add(new fabric.Line([i * grid, 0, i * grid, 900], { stroke: '#000' }));
      canvas.add(new fabric.Line([0, i * grid, 900, i * grid], { stroke: '#000' }))
      canvas.add(new fabric.Rect({
        left: 100,
        top: 100,
        width: 50,
        height: 50,
        fill: 'green'
      }));
    }
    canvas.add(new fabric.Rect({
      left: 100,
      top: 100,
      width: 50,
      height: 50,
      fill: 'red',
      originX: 'left',
      originY: 'top',
      centeredRotation: true
    }));
    canvas.add(new fabric.Rect({
      left: 200,
      top: 0,
      width: 50,
      height: 50,
      fill: 'green',
      originX: 'left',
      originY: 'top',
      centeredRotation: true
    }));
  }
}