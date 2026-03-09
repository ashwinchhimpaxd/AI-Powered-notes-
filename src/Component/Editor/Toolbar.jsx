import React, { useState } from "react";
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
  TextStrikethrough,
  Code,
  Quotes,
  Palette,
  FileText,
  CaretDown,
  Sparkle
} from "@phosphor-icons/react";

function EditorToolbar({ editor, Usertype, isAiChatOpen, toggleAiChat }) {
  if (!editor) return null;

  const [highlightactive, sethighlightactive] = useState(false);
  const [coloractive, setcoloractive] = useState(false);
  const [fontSizeactive, setFontSizeactive] = useState(false);
  const [linkInputActive, setLinkInputActive] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");

  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState("My Note");

  const formattingIcons = [
    { label: "Bold", icon: <TextB /> },
    { label: "Italic", icon: <TextItalic /> },
    { label: "Underline", icon: <TextAUnderline /> },
    { label: "Strike", icon: <TextStrikethrough /> },
    { label: "Code", icon: <Code /> },
    { label: "Highlight", icon: <Highlighter /> },
    { label: "TextColor", icon: <Palette /> },
  ];

  const typographyIcons = [
    { label: "H1", icon: <TextHOne /> },
    { label: "H2", icon: <TextHTwo /> },
    { label: "Paragraph", icon: <Paragraph /> },
    { label: "Blockquote", icon: <Quotes /> },
  ];

  const listAlignIcons = [
    { label: "Bullet", icon: <ListBullets /> },
    { label: "Number", icon: <ListNumbers /> },
    { label: "Left", icon: <TextAlignLeft /> },
    { label: "Center", icon: <TextAlignCenter /> },
    { label: "Right", icon: <TextAlignRight /> },
    { label: "Justify", icon: <TextAlignJustify /> },
  ];

  const insertIcons = [
    { label: "Link", icon: <LinkSimple /> },
    { label: "Image", icon: <Panorama /> },
  ];

  const highlightColor = [
    { color: "#ef4444" },
    { color: "#16a34a" },
    { color: "#3b82f6" },
    { color: "#a78bfa" },
    { color: "#fcd34d" },
  ];

  const textColors = [
    { color: "#000000" },
    { color: "#ffffff" },
    { color: "#ef4444" },
    { color: "#16a34a" },
    { color: "#3b82f6" },
    { color: "#a78bfa" },
    { color: "#f97316" },
  ];

  const fontSizes = ["12px", "14px", "16px", "18px", "20px", "24px", "30px", "36px"];

  const CheckTitle = () => {
    if (title.trim().length === 0) {
      setTitle("Untitled");
      return;
    }
    setTitle(title.replace(/\s+/g, ' ').trim());
  }

  const isActive = (label) => {
    if (!editor) return false;
    switch (label) {
      case "Bold": return editor.isActive("bold");
      case "Italic": return editor.isActive("italic");
      case "Underline": return editor.isActive("underline");
      case "Strike": return editor.isActive("strike");
      case "Code": return editor.isActive("code");
      case "Highlight": return editor.isActive("highlight");
      case "H1": return editor.isActive("heading", { level: 1 });
      case "H2": return editor.isActive("heading", { level: 2 });
      case "Paragraph": return editor.isActive("paragraph");
      case "Blockquote": return editor.isActive("blockquote");
      case "Bullet": return editor.isActive("bulletList");
      case "Number": return editor.isActive("orderedList");
      case "Center": return editor.isActive({ textAlign: "center" });
      case "Justify": return editor.isActive({ textAlign: "justify" });
      case "Left": return editor.isActive({ textAlign: "left" });
      case "Right": return editor.isActive({ textAlign: "right" });
      case "Link": return editor.isActive("link");
      default: return false;
    }
  };

  const onClickfx = (label, value) => {
    switch (label) {
      // Formatting
      case "Bold": return editor.chain().focus().toggleBold().run();
      case "Italic": return editor.chain().focus().toggleItalic().run();
      case "Underline": return editor.chain().focus().toggleUnderline().run();
      case "Strike": return editor.chain().focus().toggleStrike().run();
      case "Code": return editor.chain().focus().toggleCode().run();
      case "Highlight": return editor.chain().focus().toggleHighlight({ color: value.color }).run();
      case "TextColor": return editor.chain().focus().setColor(value.color).run();
      case "FontSize": return editor.chain().focus().setFontSize(value).run();

      // Typography
      case "H1": return editor.chain().focus().toggleHeading({ level: 1 }).run();
      case "H2": return editor.chain().focus().toggleHeading({ level: 2 }).run();
      case "Paragraph": return editor.chain().focus().setParagraph().run();
      case "Blockquote": return editor.chain().focus().toggleBlockquote().run();

      // Lists & Alignment
      case "Bullet": return editor.chain().focus().toggleBulletList().run();
      case "Number": return editor.chain().focus().toggleOrderedList().run();
      case "Center": return editor.chain().focus().setTextAlign("center").run();
      case "Justify": return editor.chain().focus().setTextAlign("justify").run();
      case "Left": return editor.chain().focus().setTextAlign("left").run();
      case "Right": return editor.chain().focus().setTextAlign("right").run();

      // Insert
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
      case "SaveLink": {
        if (!value) {
          editor.chain().focus().extendMarkRange('link').unsetLink().run();
        } else {
          editor.chain().focus().extendMarkRange('link').setLink({ href: value }).run();
        }
        setLinkInputActive(false);
        return;
      }
      default: return;
    }
  };

  const renderIconGroup = (icons, groupLabel) => {
    return (
      <div className="flex flex-col items-center justify-between border-r-[1px] border-white/10 px-4 h-full min-w-max ">
        <div className="flex gap-1 items-center justify-center flex-1">
          {icons.map((icone, index) => {
            if (icone.label === "Highlight") {
              return (
                <div className="cursor-pointer relative" key={icone.label}>
                  <button
                    className={`cursor-pointer text-[1.2rem] px-2 py-1.5 rounded-md transition-colors text-white hover:bg-white/10`}
                    onClick={() => { sethighlightactive(!highlightactive); setcoloractive(false); setFontSizeactive(false); setLinkInputActive(false); }}
                  >
                    {icone.icon}
                  </button>
                  {highlightactive && (
                    <div className="absolute top-full mt-0 left-1/2 -translate-x-1/2 border border-white/10 shadow-lg rounded p-1 flex bg-[#2a2a2a] gap-2 cursor-pointer z-[100]">
                      {highlightColor.map((color, idx) => (
                        <button
                          key={idx}
                          className="cursor-pointer h-6 w-6 rounded-md border border-white/20 hover:scale-110 transition-transform"
                          style={{ backgroundColor: color.color }}
                          onClick={() => { onClickfx("Highlight", color); sethighlightactive(false); }}
                        />
                      ))}
                    </div>
                  )}
                </div>
              );
            } else if (icone.label === "TextColor") {
              return (
                <div className="cursor-pointer relative" key={icone.label}>
                  <button
                    className={`cursor-pointer text-[1.2rem] px-2 py-1.5 rounded-md transition-colors text-white hover:bg-white/10`}
                    onClick={() => { setcoloractive(!coloractive); sethighlightactive(false); setFontSizeactive(false); setLinkInputActive(false); }}
                  >
                    {icone.icon}
                  </button>
                  {coloractive && (
                    <div className="absolute top-full mt-0 left-1/2 -translate-x-1/2 border border-white/10 shadow-lg rounded p-1 flex flex-wrap w-[150px] bg-[#2a2a2a] gap-2 cursor-pointer z-[100]">
                      {textColors.map((color, idx) => (
                        <button
                          key={idx}
                          className="cursor-pointer h-6 w-6 rounded-md border border-white/20 hover:scale-110 transition-transform"
                          style={{ backgroundColor: color.color }}
                          onClick={() => { onClickfx("TextColor", color); setcoloractive(false); }}
                        />
                      ))}
                      <input
                        type="color"
                        className="cursor-pointer h-6 w-6 rounded-md border border-white/20 p-0"
                        onChange={(e) => { onClickfx("TextColor", { color: e.target.value }); setcoloractive(false); }}
                      />
                    </div>
                  )}
                </div>
              );
            }

            if (icone.label === "Link") {
              return (
                <div className="cursor-pointer relative" key={icone.label}>
                  <button
                    className={`cursor-pointer text-[1.2rem] px-2 py-1.5 rounded-md transition-colors text-white hover:bg-white/10`}
                    onClick={() => { setLinkInputActive(!linkInputActive); setLinkUrl(editor.getAttributes('link').href || ""); setcoloractive(false); sethighlightactive(false); setFontSizeactive(false); }}
                  >
                    {icone.icon}
                  </button>
                  {linkInputActive && (
                    <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 border border-white/10 shadow-lg rounded p-2 flex bg-[#2a2a2a] gap-2 z-[100] min-w-[250px] items-center">
                      <input
                        type="url"
                        placeholder="Paste link here..."
                        className="flex-1 bg-transparent border-b border-white/20 text-white text-sm outline-none px-1 py-1"
                        value={linkUrl}
                        onChange={(e) => setLinkUrl(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            onClickfx("SaveLink", linkUrl);
                          }
                        }}
                      />
                      <button
                        className="text-xs bg-blue-600 hover:bg-blue-700 text-white px-2 py-1.5 rounded cursor-pointer transition-colors"
                        onClick={() => onClickfx("SaveLink", linkUrl)}
                      >
                        Add
                      </button>
                    </div>
                  )}
                </div>
              );
            }

            return (
              <button
                key={icone.label}
                className={`cursor-pointer text-[1.2rem] px-2 py-1.5 rounded-md transition-colors text-white hover:bg-white/10`}
                onClick={() => onClickfx(icone.label)}
                title={icone.label}
              >
                {icone.icon}
              </button>
            );
          })}
        </div>
        {groupLabel && <span className="text-[10px] text-white/50 uppercase tracking-wider font-semibold mt-3 mb-1">{groupLabel}</span>}
      </div>
    );
  };

  return (
    <div className="relative z-50 bg-[#1e1e1e] shadow-md border-b border-black/50">
      <div className='w-full border-b-[1px] border-white/5 min-h-12 justify-between items-center flex px-5 py-2 bg-[#2a2a2a]'>
        {!editing ? (
          <h2 onClick={() => setEditing(true)} className='text-xl font-semibold p-1 cursor-text text-white'>
            {title}
          </h2>
        ) : (
          <input
            type="text"
            className='text-xl font-semibold w-1/2 p-1 border-b border-blue-500 outline-none bg-transparent text-white'
            autoFocus
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onBlur={() => { CheckTitle(); setEditing(false); }}
            onKeyDown={(e) => {
              if (e.key === "Enter") { CheckTitle(); setEditing(false); }
            }}
          />
        )}

        <div className="flex items-center gap-3">
          <button
            onClick={toggleAiChat}
            className={`group active:scale-95 transition-all duration-150 cursor-pointer flex items-center justify-center p-2 rounded-full border ${isAiChatOpen ? 'bg-[#18181b] border-white/20 text-[#a9c9f9]' : 'bg-transparent border-transparent text-white hover:bg-white/10'}`}
            title="Toggle AI Chat"
          >
            <Sparkle className='size-5' weight={isAiChatOpen ? "fill" : "regular"} />
          </button>

          <button className="group active:scale-95 transition-all duration-150 cursor-pointer relative inline-flex h-9 items-center justify-center overflow-hidden bg-blue-700 px-4 font-medium text-neutral-50 rounded-full">
            <span className="absolute h-0 w-0 rounded-full bg-blue-800 transition-all duration-600 group-hover:h-54 group-hover:w-40"></span>
            <span className="relative flex justify-center items-center leading-[20px] gap-2 text-sm">
              <FileText className='size-5' weight="fill" />Save
            </span>
          </button>
        </div>
      </div>

      <div id="text-formatting" className="flex items-center flex-wrap px-4 min-h-[96px] py-3 gap-x-2 gap-y-4">
        {renderIconGroup(formattingIcons, "Font")}

        {/* Font Size Selector */}
        <div className="flex flex-col items-center justify-between border-r-[1px] border-white/10 px-6 h-full min-w-max relative">
          <div className="flex gap-1 items-center justify-center flex-1">
            <button
              className="flex items-center gap-2 text-white text-sm px-3 py-1.5 rounded-md hover:bg-white/10 transition-colors border border-white/20 bg-white/5"
              onClick={() => { setFontSizeactive(!fontSizeactive); sethighlightactive(false); setcoloractive(false); setLinkInputActive(false); }}
            >
              <span>{editor.getAttributes('textStyle').fontSize || "Size"}</span>
              <CaretDown weight="bold" />
            </button>
            {fontSizeactive && (
              <div className="absolute  top-[60%] mt-2 left-4 border border-white/10 rounded-md py-1 flex flex-col bg-[#2a2a2a] w-24 cursor-pointer z-[110] shadow-2xl max-h-48 overflow-y-auto">
                {fontSizes.map((size) => (
                  <button
                    key={size}
                    className="text-white text-sm hover:bg-blue-600 w-full text-left px-4 py-1.5 transition-colors"
                    onClick={() => { onClickfx("FontSize", size); setFontSizeactive(false); }}
                  >
                    {size}
                  </button>
                ))}
              </div>
            )}
          </div>
          <span className="text-[10px] text-white/50 uppercase tracking-wider font-semibold mt-3 mb-1">Size</span>
        </div>

        {renderIconGroup(typographyIcons, "Styles")}
        {renderIconGroup(listAlignIcons, "Paragraph")}
        {renderIconGroup(insertIcons, "Insert")}
      </div>
    </div>
  );
}

export default EditorToolbar;
