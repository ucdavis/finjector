import React, { useEffect, useId, useRef, useState } from "react";

interface FinButtonDropdownProps {
  title?: string;
  disabled?: boolean;
  children?: React.ReactNode;
  end?: boolean;
  shouldRenderAsDropdown?: boolean;
}

const FinButtonDropdown = (props: FinButtonDropdownProps) => {
  const {
    title,
    disabled = false,
    children,
    end = true,
    shouldRenderAsDropdown = true,
  } = props;
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const container = useRef<HTMLDivElement>(null);
  const toggle = useRef<HTMLButtonElement>(null);
  const panelId = useId();

  useEffect(() => {
    if (!dropdownOpen) return;
    const closeOutside = (event: PointerEvent) => {
      if (!container.current?.contains(event.target as Node)) setDropdownOpen(false);
    };
    document.addEventListener("pointerdown", closeOutside);
    return () => document.removeEventListener("pointerdown", closeOutside);
  }, [dropdownOpen]);

  if (!shouldRenderAsDropdown) return <>{children}</>; // on personal team, default folder

  const closeAndFocusToggle = () => {
    toggle.current?.focus();
    setDropdownOpen(false);
  };

  return (
    <div
      className="dropdown"
      ref={container}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setDropdownOpen(false);
      }}
      onKeyDown={(event) => {
        if (event.key === "Escape" && dropdownOpen && event.currentTarget.contains(event.target as Node)) {
          event.stopPropagation();
          closeAndFocusToggle();
        }
      }}
    >
      <button
        type="button"
        ref={toggle}
        className="btn btn-finjector dropdown-toggle"
        disabled={disabled}
        aria-expanded={dropdownOpen}
        aria-controls={panelId}
        onClick={() => setDropdownOpen((open) => !open)}
      >
        Actions
      </button>
      <div
        id={panelId}
        hidden={!dropdownOpen}
        data-bs-popper="static"
        className={`dropdown-menu dropdown-menu-finjector ${end ? "dropdown-menu-end" : ""} ${dropdownOpen ? "show" : ""}`}
        onClickCapture={(event) => {
          const target = event.target as Element;
          if (event.currentTarget.contains(target) && target.closest("a[href], button:enabled")) {
            closeAndFocusToggle();
          }
        }}
      >
        {title && <div className="dropdown-header">{title}</div>}
        {children}
      </div>
    </div>
  );
};

export default FinButtonDropdown;
