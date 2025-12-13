import React from "react";
import { useState } from "react";
import {
  TextB,
  TextItalic,
  LinkSimple,
  Panorama,
  Highlighter,
  TextAUnderline,
  TextHOne,
  TextHTwo,
  Paragraph,
  TextAlignCenter,
  TextAlignJustify,
  TextAlignLeft,
  TextAlignRight,
  ListBullets,
  ListNumbers,
  Prohibit
} from "@phosphor-icons/react";


function EditorToolbar({ editor }) {
  if (!editor) return null;


  const [highlightactive, sethighlightactive] = useState(false)
  const icons = [
    { label: "Bold", icon: <TextB /> },
    { label: "Italic", icon: <TextItalic /> },
    { label: "H1", icon: <TextHOne /> },
    { label: "H2", icon: <TextHTwo /> },
    { label: "Paragraph", icon: <Paragraph /> },
    { label: "Highlight", icon: <Highlighter /> },
    { label: "Underline", icon: <TextAUnderline /> },
  ];

  const ListIcone = [
    {
      label: "Bullet",
      icon: <ListBullets />,
      Otherlist: {
        label: "Numberlist",
        icone: <ListNumbers />

      }
    }

  ]

  const icons2 = [
    { label: "Center", icon: <TextAlignCenter /> },
    { label: "Justify", icon: <TextAlignJustify /> },
    { label: "Left", icon: <TextAlignLeft /> },
    { label: "Right", icon: <TextAlignRight /> },
    { label: "Link", icon: <LinkSimple /> },
    { label: "Image", icon: <Panorama /> },
  ];


  const highlightColor = [
    { color: "#ef4444" },
    { color: "#16a34a" },
    { color: "#3b82f6" },
    { color: "#a78bfa" },
  ]
  const onClickfx = (label, colors) => {
    switch (label) {
      case "Bold":
        return editor.chain().focus().toggleBold().run();

      case "Italic":
        return editor.chain().focus().toggleItalic().run();

      case "H1":
        return editor.chain().focus().toggleHeading({ level: 1 }).run();

      case "H2":
        return editor.chain().focus().toggleHeading({ level: 2 }).run();

      case "Paragraph":
        return editor.chain().focus().setParagraph().run();

      case "Center":
        return editor.chain().focus().setTextAlign("center").run();

      case "Justify":
        return editor.chain().focus().setTextAlign("justify").run();

      case "Left":
        return editor.chain().focus().setTextAlign("left").run();

      case "Right":
        return editor.chain().focus().setTextAlign("right").run();

      case "Highlight":
        {
          return editor.chain().focus().toggleHighlight({ color: colors.color }).run();
        };

      case "Underline":
        return editor.chain().focus().toggleUnderline().run();

      case "Bullet":
        return editor.chain().focus().toggleBulletList().run();

      case "Image": {
        const input = document.createElement("input");
        input.type = "file";
        input.accept = "image/*";

        input.onchange = () => {
          const file = input.files?.[0];
          if (!file) return;

          const reader = new FileReader();
          reader.onload = () => {
            editor.chain().focus().setImage({ src: reader.result }).run();
          };
          reader.readAsDataURL(file);
        };

        input.click();
        return;
      }

      default:
        return;
    }
  };

  return (
    <div
      id="text-formatting"
      className="relative max-[650px]:overflow-x-auto   max-[650px]:justify-start border-[0.3px] border-white/30 flex justify-center items-end  pb-2 h-[6.5rem]"
    >
      {icons.map((icone, index) => {
        if (icone.label !== "Highlight") {

          return <button
            key={index}
            className="cursor-pointer text-[1.4rem] text-white px-4 py-2 rounded-xl hover:bg-gray-500/30"
            onClick={() => onClickfx(icone.label)}
          >
            {icone.icon}
          </button>
        } else {
          {/* highlight  */ }

          return <div className="cursor-pointer relative  ">

            <button
              className="cursor-pointer text-[1.4rem] text-white px-4 py-2 rounded-xl hover:bg-gray-500/30"
              onClick={() => sethighlightactive(!highlightactive)}

            >
              {<Highlighter />}
            </button>

            {highlightactive && (
              <div className="absolute bottom-full mb-1  left-3/2 -translate-x-1/2 border rounded p-3 flex bg-black/90 gap-2 cursor-pointer justify-center items-center">

                {highlightColor.map((color, index) => (
                  <button
                    key={index}
                    className={`cursor-pointer h-5 w-5 text-[1.4rem] text-white  rounded-full `}
                    style={{ backgroundColor: color.color }}
                    onClick={() => onClickfx("Highlight", color)}
                  >
                  </button>
                ))}
                {/* <div className=" h-8 w-8  flex justify-center items-center rounded-full overflow-hidden  " onClick={() => editor.chain().focus().unsetHighlight().run()}>
              <Prohibit className="  text-black hover:bg-gray-500/30   h-full  w-full inline-block p-1" />
            </div> */}
              </div>
            )}
          </div>
        }
      })}

      <div className="flex justify-center items-center border-l-[1.5px] border-white/30 ml-2">
        {icons2.map((icone, index) => (
          <button
            key={index}
            className="cursor-pointer text-[1.5rem] text-white px-4 py-2 rounded-xl hover:bg-black/30"
            onClick={() => onClickfx(icone.label)}
          >
            {icone.icon}
          </button>
        ))}
      </div>


    </div>
  );
}

export default EditorToolbar;
