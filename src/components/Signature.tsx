import React, { useRef, useEffect, useImperativeHandle } from "react";
import SignaturePad from "signature_pad";
import { forwardRef } from "react";
import "../App.css";

export type SignatureRef = {
  getSVG: () => void;
};

interface SignatureProps {}

export const Signature = forwardRef(
  ({}: SignatureProps, ref: React.Ref<SignatureRef>) => {
    // Refs for the canvas and SignaturePad instance
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const signaturePadRef = useRef<SignaturePad | null>(null);

    // Initialize SignaturePad on component mount
    useEffect(() => {
      const canvas = canvasRef.current;

      if (canvas) {
        const signaturePad = new SignaturePad(canvas, {
          // Adjusting the canvas size to fix blurry signature pad on mobile devices
          backgroundColor: "rgb(255,255,255)",
          penColor: "black",
        });

        // Save the SignaturePad instance to a ref
        signaturePadRef.current = signaturePad;
      }
    }, []);

    // Function to clear the signature from the canvas
    const clearSignature = () => {
      if (signaturePadRef.current) {
        signaturePadRef.current.clear();
      }
    };

    const getSVG = () => {
      if (signaturePadRef.current) {
        //   const dataUrl = signaturePadRef.current.toDataURL("image/svg+xml");
        const svg = signaturePadRef.current.toSVG();
        return svg;
      } else {
        return "empty";
      }
    };

    useImperativeHandle(ref, () => ({ getSVG }));

    return (
      <div style={{ position: "relative", display: "inline-block" }}>
        <canvas ref={canvasRef} style={{ border: "2px solid gray" }} />
        <button
          onClick={clearSignature}
          type="button"
          className="clear-button btn-close"
          aria-label="Close"
        ></button>
      </div>
    );
  }
);
