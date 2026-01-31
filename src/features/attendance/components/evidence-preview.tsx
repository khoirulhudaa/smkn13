/* eslint-disable @typescript-eslint/no-explicit-any */
import { getStaticFile } from "@/core/utils";
import Lightbox, { SlideImage } from "yet-another-react-lightbox";
import Captions from "yet-another-react-lightbox/plugins/captions";

import React from "react";

export interface EvidenceItem {
  image?: string;
  title?: string;
  status?: string;
}

export interface EvidencePreviewProps {
  items?: EvidenceItem[];
}

export const EvidencePreview = React.memo(
  ({ items = [] }: EvidencePreviewProps) => {
    const [open, setOpen] = React.useState(false);
    const [index, setIndex] = React.useState(0);

    const handleClickImage = (e: any, i: number) => {
      e?.preventDefault?.();
      setOpen((v) => !v);
      setIndex(i);
    };

    return (
      <>
        <div className="flex flex-row gap-2">
          {items?.map((item, i) => {
            return (
              <a href="#" key={i} onClick={(e) => handleClickImage(e, i)}>
                <img
                  src={getStaticFile(String(item.image))}
                  alt={item.title}
                  className="h-12 w-12 rounded-md object-cover"
                />
              </a>
            );
          })}
        </div>
        <Lightbox
          index={index}
          open={open}
          plugins={[Captions]}
          close={() => {
            setOpen(false);
            setIndex(0);
          }}
          slides={
            (items?.map((d) => ({
              src: d.image,
              alt: d.title,
              title: d.title,
              description: d.status,
              type: "image",
              // imageFit: "cover",
            })) as SlideImage[]) || []
          }
        />
      </>
    );
  },
);
