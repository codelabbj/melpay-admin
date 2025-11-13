import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {X} from "lucide-react";
import React from "react";

export type CustomInputProps = {
    onChange: (e:React.ChangeEvent<HTMLInputElement>) => void;
    disabled: boolean;
    selectedFile?: File | null;
    onClear?: () => void;
}

export default function CustomInput({onChange, disabled, selectedFile, onClear }:CustomInputProps){
    return (
        <div className="flex items-center gap-2 w-full">
            <div className="relative flex-1">
                <input
                    type="file"
                    onChange={onChange}
                    disabled={disabled}
                    className="hidden"
                    id="custom-file-input"
                />
                <div className="flex items-center gap-2">
                    <Input
                        type="text"
                        readOnly
                        value={selectedFile?.name || ""}
                        placeholder="Choisir un fichier"
                        disabled={disabled}
                        className="flex-1 cursor-pointer"
                        onClick={() => document.getElementById('custom-file-input')?.click()}
                    />
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => document.getElementById('custom-file-input')?.click()}
                        disabled={disabled}
                    >
                        Parcourir
                    </Button>
                </div>
            </div>
            {selectedFile && (
                <Button variant="ghost" size="sm" onClick={onClear} disabled={disabled}>
                    <X className="h-4 w-4" />
                </Button>
            )}
        </div>
    )
}