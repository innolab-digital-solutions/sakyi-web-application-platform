/* eslint-disable unicorn/no-null */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { useState } from "react";

import { ContentEditable } from "@/components/editor/editor-ui/content-editable";

export function Plugins() {
  const [floatingAnchorElement, setFloatingAnchorElement] = useState<HTMLDivElement | null>(null);

  const onReference = (_floatingAnchorElement: HTMLDivElement) => {
    if (_floatingAnchorElement !== null) {
      setFloatingAnchorElement(_floatingAnchorElement);
    }
  };

  return (
    <div className="relative">
      {/* toolbar plugins */}
      <div className="relative">
        <RichTextPlugin
          contentEditable={
            <div className="">
              <div className="" ref={onReference}>
                <ContentEditable placeholder={"Start typing ..."} />
              </div>
            </div>
          }
          ErrorBoundary={LexicalErrorBoundary}
        />
        {/* editor plugins */}
      </div>
      {/* actions plugins */}
    </div>
  );
}
