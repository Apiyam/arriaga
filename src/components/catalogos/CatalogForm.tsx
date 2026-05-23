import { useForm } from "@refinedev/react-hook-form";
import { AppLayout } from "../dashboard/Layout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useParams } from "react-router";
import { RichTextEditor } from "@/components/ui/rich-text-editor";
import { useState, useEffect } from "react";

interface CatalogFormProps {
  resource: string;
  title: string;
  description: string;
  fields?: {
    name: string;
    label: string;
    type?: string;
    required?: boolean;
    options?: { value: string; label: string }[];
  }[];
}

export const CatalogForm = ({ resource, title, description, fields }: CatalogFormProps) => {
  const { id } = useParams();
  const isEdit = !!id;
  const [descriptionValue, setDescriptionValue] = useState<string>("");
  
  const {
    refineCore: { onFinish, formLoading },
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    refineCoreProps: {
      resource,
      id: id,
      action: isEdit ? "edit" : "create",
      redirect: "list",
    },
  });

  const currentDescription = watch("description");

  useEffect(() => {
    if (currentDescription) {
      setDescriptionValue(currentDescription);
    }
  }, [currentDescription]);

  const handleDescriptionChange = (value: string) => {
    setDescriptionValue(value);
    setValue("description", value);
  };

  const defaultFields = [
    { name: "catalog_name", label: "Nombre", required: true },
    { name: "description", label: "Descripción", type: "textarea" },
  ];

  const formFields = fields || defaultFields;

  return (
    <AppLayout title={title} description={description}>
      <form onSubmit={handleSubmit(onFinish)}>
        <Card className="p-6 space-y-6">
          {formFields.map((field) => (
            <div key={field.name}>
              <Label htmlFor={field.name}>
                {field.label} {field.required && "*"}
              </Label>
              {field.type === "textarea" ? (
                <div className="mt-1">
                  <RichTextEditor
                    value={descriptionValue}
                    onChange={handleDescriptionChange}
                    placeholder={`Escribe la ${field.label.toLowerCase()}...`}
                  />
                </div>
              ) : field.options ? (
                <select
                  id={field.name}
                  {...register(field.name, { required: field.required })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md mt-1"
                >
                  <option value="">Seleccionar...</option>
                  {field.options.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              ) : (
                <Input
                  id={field.name}
                  type={field.type || "text"}
                  {...register(field.name, { required: field.required })}
                  className="mt-1"
                />
              )}
              {errors[field.name as keyof typeof errors] && (
                <p className="text-red-500 text-sm mt-1">Este campo es requerido</p>
              )}
            </div>
          ))}

          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => window.history.back()}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={formLoading}>
              {formLoading ? "Guardando..." : (isEdit ? "Actualizar" : "Guardar")}
            </Button>
          </div>
        </Card>
      </form>
    </AppLayout>
  );
};

