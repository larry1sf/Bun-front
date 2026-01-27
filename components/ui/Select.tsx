'use client';

import { ChevronDown } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { useDropDown } from '../hooks/dropDown';

interface SelectOption {
    value: string;
    label: string;
}

interface SelectProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
    label?: string;
    error?: string;
    helperText?: string;
    options: SelectOption[];
    rightElement?: React.ReactNode;
    name?: string;
    value?: string;
    placeholder?: string;
    disabled?: boolean;
    onChange?: (value: string) => void;
}

export const Select = ({
    label,
    error,
    helperText,
    rightElement,
    className = '',
    id,
    options,
    name,
    value,
    placeholder = "Seleccionar opción",
    disabled,
    onChange,
    ...props
}: SelectProps) => {
    const { ref: containerRef, isDropdownOpen: isOpen, setIsDropdownOpen: setIsOpen } = useDropDown()
    const [selectedValue, setSelectedValue] = useState(value || '');

    // Update internal state if controlled value changes
    useEffect(() => {
        if (value !== undefined) {
            setSelectedValue(value);
        }
    }, [value]);

    const handleSelect = (optionValue: string) => {
        if (disabled) return;

        setSelectedValue(optionValue);
        setIsOpen(false);

        if (onChange) {
            onChange(optionValue);
        }
    };

    const selectedOption = options.find(opt => opt.value === selectedValue);

    return (
        <div className="space-y-2 w-full" ref={containerRef}>
            {/* Hidden input for form submission */}
            {name && <input type="hidden" name={name} value={selectedValue} />}

            {label && (
                <div className="flex justify-between items-center px-1">
                    <label htmlFor={id} className="text-xs md:text-sm font-medium text-slate-300 ml-1 block">
                        {label}
                    </label>
                    {rightElement}
                </div>
            )}

            <div className="relative">
                {/* Trigger */}
                <div
                    id={id}
                    onClick={() => !disabled && setIsOpen(!isOpen)}
                    className={`
                        relative w-full px-5 py-4 bg-slate-950/50 border rounded-2xl cursor-pointer 
                        flex items-center justify-between transition-all duration-300
                        ${error
                            ? 'border-red-500/50'
                            : isOpen
                                ? 'border-blue-500/50 ring-4 ring-blue-500/10'
                                : 'border-slate-800 hover:border-slate-700'
                        }
                        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
                        ${className} 
                    `}
                    {...props}
                >
                    <span className={`truncate max-w-[100px] ${selectedValue ? 'text-slate-100' : 'text-slate-600'}`}>
                        {selectedOption ? selectedOption.label : placeholder}
                    </span>
                    <ChevronDown
                        className={`w-5 h-5 text-slate-500 transition-transform duration-200 ${isOpen ? 'transform rotate-180' : ''}`}
                    />
                </div>

                {/* Dropdown Options */}
                {isOpen && (
                    <div className="absolute z-50 w-full mt-2 bg-slate-950 border border-slate-800 rounded-xl shadow-xl overflow-hidden max-h-60 overflow-y-auto">
                        <ul className="py-1">
                            {options.map((option) => (
                                <li
                                    key={option.value}
                                    onClick={() => handleSelect(option.value)}
                                    className={`
                                        px-5 py-3 text-sm cursor-pointer transition-colors duration-150
                                        ${selectedValue === option.value
                                            ? 'bg-blue-600/10 text-blue-400 font-medium'
                                            : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                                        }
                                    `}
                                >
                                    {option.label}
                                </li>
                            ))}
                            {options.length === 0 && (
                                <li className="px-5 py-3 text-sm text-slate-500 italic">
                                    No hay opciones
                                </li>
                            )}
                        </ul>
                    </div>
                )}
            </div>

            {error && <p className="text-xs text-red-400 ml-1">{error}</p>}
            {!error && helperText && <p className="text-xs text-slate-500 ml-1">{helperText}</p>}
        </div>
    );
};
