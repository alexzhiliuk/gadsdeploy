import React, { ChangeEvent } from 'react';


interface IInputProps {
    label: string,
    labelStyles?: object,
    labelClass?: string,
    inputName: string,
    inputStyles?: object,
    inputClass?: string,
    type?: string,
    required: boolean,
    value?: string,
    fieldName?: string,
    onChangeCallback: (value: string, field?: string) => void
}


function Input({ label, labelStyles={}, labelClass="", inputName, inputStyles={}, type="text", inputClass="", required, value="", fieldName, onChangeCallback }: IInputProps) {

    return (
        <label style={labelStyles} className={labelClass}>
            {label}
            <input 
                title="Это поле обязательно для заполнения"
                type={type} 
                value={value}
                name={inputName} 
                required={required} 
                style={inputStyles} 
                className={inputClass} 
                onChange={(e: ChangeEvent<HTMLInputElement>) => {fieldName ? onChangeCallback(e.target.value, fieldName) : onChangeCallback(e.target.value)}}
            />
        </label>
    );
  }
  
export default Input;
  