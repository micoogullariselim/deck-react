import React from "react";
import DeckGL from "@deck.gl/react";
import "./App.css";
import { ScatterplotLayer, BitmapLayer, HeatmapLayer, IconLayer, TextLayer, PathLayer, ColumnLayer, GridLayer, HexagonLayer} from "deck.gl";
import {TileLayer} from "@deck.gl/geo-layers"


export default function App(){

  const initialViewState={
    longitude: 27.1,
    latitude: 38.4,
    zoom:8,
    pitch: 40,
    bearing: 0,
  };



   const tileLayer = new TileLayer({
    id: "osm-base-map",
    data: "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
    minZoom: 0,
    maxZoom: 19,
    tileSize: 256,

    renderSubLayers: props => {
      const {
        bbox: { west, south, east, north }
      } = props.tile;

      const image = props.data;

      if (!image) return null;

      return new BitmapLayer(props, {
        data: null,
        image,
        bounds: [west, south, east, north]
      });
    }
  });

  
  //---PointLayer-----------------------------------------------------------
  const pointLayer = new ScatterplotLayer({
    id: "izmir",
    data: [
      { name: "İzmir", position: [27.1, 38.4], value : 20 },
      { name: "Ankara", position: [32.859, 39.933], value: 30 },
    ],
    getPosition:d => d.position,
    getFillColor:d => d.value >21 ? [255,0,0] : [0, 0, 255],
    getRadius: 30,
    radiusUnits: "pixels",
    pickable: true,
    onClick: info => console.log("tıklanan veri:",info.object),

  });


  //-IconLayer-----------------------------------------------------------
  const ıcon = new IconLayer({
    id: "ıcon",
    data: [
      { name: "İzmir", position: [27.1, 38.4], value : 20 },
      { name: "Ankara", position: [32.859, 39.933], value: 30 },
    ],
    getIcon: d=> "marker",
    iconAtlas:"icon-atlas.png",
    iconMapping:{
      marker: {x:0,y:0,width:256,height:256}
    },
    getSize:40,
    getPosition: d => d.position,
  })

  //--HeatmapLayer-----------------------------------------------
  const heat = new HeatmapLayer({
    id: "heatmap",
    data: [
      { name: "İzmir", position: [27.1, 38.4], value : 200 },
      { name: "Ankara", position: [32.859, 39.933], value: 30 },
    ],
    getPosition: d=> d.position,
    getWeight: d=> d.value,
    radiusPixels: 20,
    pickable:true,
    
  })

  //--TextLayer----------------------------------------------------
  const metın = new TextLayer({
  id: "text-labels",
  data: [
    { name: "İzmir", position: [27.1, 38.4], value : 200 },
    { name: "Ankara", position: [32.859, 39.933], value: 30 },
  ],
  getPosition: d => d.position,
  getText: d => d.name,
  getSize: 50,
  getColor: [0,0,255],
  fontFamily: "Poppins, Arial, Helvetica, sans-serif",
  characterSet:
  " ABCÇDEFGĞHIİJKLMNOÖPRSŞTUÜVYZabcçdefgğhıijklmnoöprsştuüvyz0123456789",
  fontSettings: {
  sdf: false,
  buffer: 8,
  cutoff: 0.1
},
})

  //--PathLayer-------------------------------------------
  const yol = new PathLayer({
  id: "paths",
  data: [
    { name: "İzmir", coordinates:[
        [27.1, 38.4],      
        [32.859, 39.933]] }
  ],
  getPath: d => d.coordinates,
  getColor: [0, 0, 255],
  widthUnits: "pixels",
  getWidth: 2
  })


  // --ColumnLayer-----------------------------------------------------
 const column= new ColumnLayer({
  id: "3d-columns",
  data: [
    { name: "İzmir", position: [27.1, 38.4], value : 2000 },
    { name: "Ankara", position: [32.859, 39.933], value: 3000 },
  ],
  diskResolution: 12,
  radius: 800,
  extruded: true,
  elevationScale: 50,
  getElevation: d => d.value,
  getPosition: d => d.position,
  getFillColor: d => d.value >2001 ? [255, 140, 0] : [0,0,255]
  })




  //--HexagonLayer-------------------------------------------
 function generatePoints(center, count) {
  const [lon, lat] = center;
  const pts = [];

  for (let i = 0; i < count; i++) {
    pts.push({
      position: [
        lon + (Math.random() - 0.5) * 0.1,  // 0.1 derece içi yay
        lat + (Math.random() - 0.5) * 0.1
      ]
    });
  }
  return pts;
  }

  const data = [
  ...generatePoints([27.1, 38.4], 2000),
  ...generatePoints([32.859, 39.933], 3000)
];



 const hexa = new HexagonLayer({
  id: "hex",
  data,
  getPosition: d => d.position,
  radius: 200,
  extruded: true,
  elevationScale: 50
  })




  return (
    <DeckGL
    initialViewState={initialViewState}
    controller={true}
    layers={[tileLayer,pointLayer]} // Görülmek istenen layer burda değiştirilerek görülebilir.
    getTooltip={({object})=>
    
      object && {
        text:`Şehir: ${object.name} \n Konum: ${object.position}`
      }
    }
    style={{width:"100vw",height:"100vh"}}
    />
    
  );


}

