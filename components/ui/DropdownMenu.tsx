"use client"

import { useState, useRef, useLayoutEffect, ReactNode } from "react"
import { createPortal } from "react-dom"
import { useDropDown } from "@/components/hooks/dropDown"

interface DropdownItem {
    label: string
    icon?: ReactNode
    onClick: (e: React.MouseEvent) => void
    variant?: "default" | "danger"
}

interface DropdownMenuProps {
    trigger: ReactNode
    items: DropdownItem[]
    width?: string
    position?: "top" | "bottom"
    animation?: "from-top" | "from-bottom" | "from-right"
    textSize?: "text-xs" | "text-sm"
}

export function DropdownMenu({
    trigger,
    items,
    width = "w-52",
    position = "bottom",
    animation = "from-top",
    textSize = "text-sm"
}: DropdownMenuProps) {
    const { isDropdownOpen, setIsDropdownOpen, ref: menuRef } = useDropDown()
    const [coords, setCoords] = useState<{ top: number, left: number } | null>(null)
    const triggerContainerRef = useRef<HTMLDivElement>(null)

    const updateCoords = () => {
        if (triggerContainerRef.current) {
            const rect = triggerContainerRef.current.getBoundingClientRect()
            const dropdownWidth = parseInt(width.replace("w-", "")) * 4 || 208

            if (position === "bottom") {
                setCoords({
                    top: rect.bottom + 8,
                    left: rect.right - dropdownWidth
                })
            } else {
                // Para posición 'top' (como el menú de usuario)
                // Usamos 160px como altura estimada o calculamos dinámicamente
                setCoords({
                    top: rect.top - (items.length * 45) - 10,
                    left: rect.left
                })
            }
        }
    }

    const animationClasses = {
        "from-top": "slide-in-from-top-2",
        "from-bottom": "slide-in-from-bottom-2",
        "from-right": "slide-in-from-right-2"
    }

    useLayoutEffect(() => {
        if (isDropdownOpen) {
            updateCoords()
            const handleScroll = () => updateCoords()
            const handleResize = () => updateCoords()

            window.addEventListener('scroll', handleScroll, true)
            window.addEventListener('resize', handleResize)

            return () => {
                window.removeEventListener('scroll', handleScroll, true)
                window.removeEventListener('resize', handleResize)
            }
        }
    }, [isDropdownOpen])

    return (
        <>
            <div
                ref={triggerContainerRef}
                className="inline-block"
                onClick={(e) => {
                    e.stopPropagation()
                    setIsDropdownOpen(!isDropdownOpen)
                }}
            >
                {trigger}
            </div>

            {isDropdownOpen && coords && createPortal(
                <div
                    ref={menuRef as any}
                    style={{
                        position: 'fixed',
                        top: coords.top,
                        left: coords.left,
                        zIndex: 9999
                    }}
                    className={`${width} bg-slate-900 border border-slate-800 rounded-xl shadow-2xl overflow-hidden animate-in fade-in ${animationClasses[animation]} duration-200`}
                >
                    {items.map((item, index) => (
                        <div key={index}>
                            <button
                                className={`w-full flex items-center space-x-3 px-4 py-3 ${textSize} transition-colors cursor-pointer
                                    ${item.variant === "danger"
                                        ? "text-red-400 hover:bg-red-500/10"
                                        : "text-slate-300 hover:bg-slate-800/50"
                                    }
                                `}
                                onClick={(e) => {
                                    e.stopPropagation()
                                    item.onClick(e)
                                    setIsDropdownOpen(false)
                                }}
                            >
                                {item.icon && <span className="shrink-0">{item.icon}</span>}
                                <span>{item.label}</span>
                            </button>
                            {index < items.length - 1 && (
                                <div className="border-t border-slate-800"></div>
                            )}
                        </div>
                    ))}
                </div>,
                document.body
            )}
        </>
    )
}
