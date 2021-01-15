import { AfterViewInit, Component, ViewEncapsulation } from "@angular/core";
import * as L from "leaflet";
declare const createVirtualGrid: any;
@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
  encapsulation: ViewEncapsulation.None
})
export class AppComponent implements AfterViewInit {
  map: L.Map;
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
    console.log(L.sync);
  }

  init() {
    this.setMapLayer();
  }

  setMapLayer() {
    for (let i = 0; i <= this.mapListArray.length - 1; i++) {
      let element = document.createElement("div");
      element.setAttribute("id", this.mapListArray[i].mapId);
      element.setAttribute("class", "mapcss")
      var parent = document.getElementsByTagName("app-root")[0].getElementsByClassName("maps-wrapper")[0]
      parent.appendChild(element);

      let mapObject = L.map(this.mapListArray[i].mapId, {
        zoomControl: false
      }).setView(this.mapListArray[i].properties.center, this.mapListArray[i].properties.zoom);
      new createVirtualGrid().virtualGrid({
        cellSize: 50
      }).addTo(mapObject);

      this.mapSlotArray.push(mapObject);

    }
    this.setTiles();
  }
  setTiles() {
    for (let i = 0; i <= this.mapListArray.length - 1; i++) {
      L.tileLayer(this.mapListArray[i].titleLayerUrl, {
      }).addTo(this.mapSlotArray[i]);
    }
    this.syncMaps()
  }

  syncMaps() {
    console.log(this.mapSlotArray[0]);
    let s = this.mapSlotArray[0];
    let r = this.mapSlotArray[1];

    //this.mapSlotArray[0].syncMaps().sync(this.mapSlotArray[1]);
  }
}
