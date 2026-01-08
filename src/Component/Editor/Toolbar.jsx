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
import { FileText } from "@phosphor-icons/react"
import { set } from 'react-hook-form';

function EditorToolbar({ editor, Usertype }) {
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


  const [editing, setEditing] = React.useState(false);

  const [title, setTitle] = React.useState("My Note");
  const CheckTitle = () => {
    if (title.trim().length === 0) {
      setTitle("Untitled");
      return;
    }
    setTitle(title.replace(/\s+/g, ' ').trim());
  }


  return (
    <div className="relative border-[0.3px]  border-white/50 z-50    b/30 rounded-t-2xl"
    >
      <div className='w-full   border-white/30  min-h-15  justify-between items-center flex px-4 py-2 '>

        {!editing ? (
          <h2 onClick={() => setEditing(true)} className='text-xl  font-semibold p-1' style={{ color: "var(--primary-text-color)" }}>
            {title}
          </h2>
        ) : (
          <input
            type="text"
            className='text-xl font-semibold w-1/2 p-1 border-none outline-none'
            style={{ color: "var(--primary-text-color)" }}
            autoFocus
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onBlur={() => {
              CheckTitle();
              setEditing(false)
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                CheckTitle();
                setEditing(false)
              };
            }}
          />
        )}

        <button class="group active:scale-95 transition-all duration-150 cursor-pointer relative inline-flex h-9 items-center justify-center overflow-hidden  bg-blue-700 px-4 font-medium text-neutral-50 rounded-full">
          <span class="absolute h-0 w-0  rounded-full bg-blue-800 transition-all duration-600 group-hover:h-54 group-hover:w-40  "></span>
          <span class="relative flex justify-center items-center leading-[20px] gap-2 text-sm  "><FileText className=' size-6 text-blue-600' fill='white' />Save </span>
        </button>
      </div>

      <div id="text-formatting" className="flex justify-center  items-center border-t-[0.5px] border-white/50 max-[1000px]:overflow-x-scroll  max-[1000px]:justify-start">

        <div className="flex justify-center h-full  items-center  border-white/30 ">


          {icons.map((icone, index) => {
            if (icone.label !== "Highlight") {

              return <button
                key={index}
                className="cursor-pointer text-[1.4rem]  text-white px-4 py-2 rounded-xl hover:bg-gray-500/30"
                onClick={() => onClickfx(icone.label)}
              >
                {icone.icon}
              </button>
            } else {
              {/* highlight  */ }

              return <div className="cursor-pointer relative  "
                key={icone.label}
              >

                <button
                  className="cursor-pointer text-[1.4rem] text-white px-4 py-2 rounded-xl hover:bg-gray-500/30 "
                  onClick={() => sethighlightactive(!highlightactive)}

                >
                  {<Highlighter />}
                </button>

                {highlightactive && (
                  <div className="absolute top-full mb-1  left-3/2 -translate-x-1/2 border rounded p-3 flex bg-black/90 gap-2 cursor-pointer justify-center items-center">

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
        </div>

        <div className="flex justify-center  h-full  items-center border-l-[1.5px] border-white/50 ">
          {icons2.map((icone, index) => (
            <button
              key={icone.label}
              className="cursor-pointer text-[1.5rem] text-white px-4 py-2 rounded-xl hover:bg-black/30"
              onClick={() => onClickfx(icone.label)}
            >
              {icone.icon}
            </button>
          ))}
        </div>
      </div>

    </div>
  );
}

export default EditorToolbar;
