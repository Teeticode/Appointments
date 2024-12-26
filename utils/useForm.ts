import { useState } from "react";
import { ZodError, ZodSchema } from "zod";

interface Field<T = any> {
    name: string;
    value: T;
    schema: ZodSchema;
}

interface FormState {
    [key: string]: any;
}

interface UseFormReturn {
    setFormValue: (name: string, value: any) => void;
    getFormValue: (name: string) => any;
    resetForm: () => void;
    formState: FormState;
    validateForm: (onSuccess: (formState: FormState) => void) => boolean;
}

const useForm = (fields: Field[]): UseFormReturn => {
    let formStateInit: FormState = {};
    fields.forEach((field) => {
        formStateInit[field.name] = field.value;
    });

    const [formState, setFormState] = useState<FormState>(formStateInit);

    const validFieldNames = fields.map((field) => field.name);

    const setValue = (name: string, value: any): void => {
        if (validFieldNames.includes(name)) {
            setFormState((prevState) => ({
                ...prevState,
                [name]: value,
            }));
        } else {
            console.error(`Invalid field name: ${name}`);
        }
    };

    const getValue = (name: string): any => {
        return formState[name];
    };

    const reset = (): void => {
        setFormState(formStateInit);
    };

    const errors: string[] = [];

    const validate = (onSuccess: (formState: FormState) => void): boolean => {
        let isValid = true;
        for (const field of fields) {
            if (field.schema.isOptional()) {
                continue;
            }

            try {
                field.schema.parse(formState[field.name]);
            } catch (error) {
                if (error instanceof ZodError) {
                    errors.push(
                        error.errors[0].message ||
                        `${error.errors[0].path.join(".")} is invalid`
                    );
                }
                isValid = false;
            }
        }

        if (isValid) {
            onSuccess(formState);
            return isValid;
        } else {
            console.log({
                title: errors[0],
                type: "error",
            });
            return isValid;
        }
    };

    return {
        setFormValue: setValue,
        getFormValue: getValue,
        resetForm: reset,
        formState,
        validateForm: validate,
    };
};

export default useForm;