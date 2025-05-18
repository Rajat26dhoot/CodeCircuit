import React, { useState, useRef, useEffect } from "react";
import { $3Dmol } from '3dmol/build/3Dmol.js';

function Atom3DViewer({ element }) {
  const viewerRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    if (!element || !containerRef.current) return;
    if (typeof window.$3Dmol === 'undefined') {
      console.error('3DMol.js not loaded');
      return;
    }

    try {
      const config = {
        backgroundColor: 'white',
        id: `viewer-${element.atomicNumber}`,
        width: containerRef.current.clientWidth,
        height: 300,
      };

      const existingViewer = document.getElementById(config.id);
      if (existingViewer) existingViewer.remove();

      const viewer = window.$3Dmol.createViewer(containerRef.current, config);
      viewerRef.current = viewer;

      viewer.addSphere({
        center: { x: 0, y: 0, z: 0 },
        radius: 1.5,
        color: 'red',
        opacity: 0.8
      });

      const shells = element.electronConfiguration
        .split(" ")
        .map(shell => Number.parseInt(shell.match(/\d+$/)[0]));

      shells.forEach((electrons, shellIndex) => {
        const radius = (shellIndex + 1) * 2.5;

        viewer.addSphere({
          center: { x: 0, y: 0, z: 0 },
          radius: radius,
          wireframe: true,
          wireframeColor: 'black',
          opacity: 0.2
        });

        for (let i = 0; i < electrons; i++) {
          const angle = (2 * Math.PI * i) / electrons;
          viewer.addSphere({
            center: {
              x: radius * Math.cos(angle),
              y: radius * Math.sin(angle),
              z: radius * Math.cos(angle * 2) * 0.5
            },
            radius: 0.3,
            color: 'blue',
            opacity: 0.8
          });
        }
      });

      viewer.zoomTo();
      viewer.render();
    } catch (error) {
      console.error('Error initializing 3DMol viewer:', error);
    }

    return () => {
      if (viewerRef.current) {
        try {
          viewerRef.current.clear();
          const canvas = containerRef.current.querySelector('canvas');
          if (canvas) canvas.remove();
        } catch (error) {
          console.error('Error cleaning up viewer:', error);
        }
      }
    };
  }, [element]);

  return (
    <div
      ref={containerRef}
      className="w-full h-[300px] rounded-lg shadow-inner relative"
      style={{
        border: '1px solid',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      <div
        id={`viewer-${element?.atomicNumber}`}
        style={{
          width: '100%',
          height: '100%',
          position: 'absolute',
          top: 0,
          left: 0
        }}
      />
    </div>
  );
}

function Detail({ label, value }) {
  return (
    <div className="flex justify-between text-sm font-semibold">
      <span className="text-black">{label}</span>
      <span className="font-medium">{value || '—'}</span>
    </div>
  );
}

export default function ElementDetails({ element }) {
  const [transform, setTransform] = useState("none");

  const handleMouseMove = (e) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = -(y - centerY) / 15;
    const rotateY = (x - centerX) / 15;

    setTransform(`scale(1.06) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`);
  };

  const handleMouseLeave = () => {
    setTransform("none");
  };

  if (!element) return null;

  return (
    <div
      className="
        flex flex-col md:flex-row p-10 rounded-2xl w-full
        max-w-[1400px] mx-auto 
        max-h-[80vh] overflow-y-auto
      "
    >
      {/* Left: Textual Details */}
      <div
        className="md:w-1/2 pr-8 p-4 rounded-xl card-3d"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          backgroundColor: element.leftsidecolor,
          transform,
          transformStyle: "preserve-3d",
          transition: "transform 0.3s ease",
          perspective: "1000px",
        }}
      >
        {/* Top section: Name, Category, and Image */}
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-5xl font-bold text-black float-3d">{element.name}</h2>
            <p className="text-2xl font-medium mt-2 text-black">{element.category}</p>
          </div>
          <div className="flex-shrink-0">
            <div className="w-24 h-24 rounded-xl overflow-hidden shadow-md">
              <img
                src={`/src/assets/${element.atomicNumber}.jpg`}
                alt={element.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = `/src/assets/${element.atomicNumber}.JPG`;
                }}
              />
            </div>
          </div>
        </div>

        {/* Details */}
        <div className="border-t pt-4 mt-2 space-y-3 text-black">
          <Detail label="Atomic Radius" value={`${element.atomicRadius} pm`} />
          <Detail label="Atomic Weight" value={`${element.mass} amu`} />
          <Detail label="Electronegativity" value={element.electronegativity} />
          <Detail label="State" value={element.state} />
          <Detail label="Ionization Energy" value={`${element.ionizationEnergy} kJ/mol`} />
        </div>
      </div>

      {/* Right: Atom Viewer */}
      <div className="md:w-1/2 flex flex-col space-y-8 ml-10">
        <div>
          <h3 className="text-2xl font-semibold mb-3 text-black">3D Atomic Structure</h3>
          <div className="h-80 rounded-xl overflow-hidden shadow-md">
            <Atom3DViewer element={element} />
          </div>
        </div>
      </div>
    </div>
  );
}


