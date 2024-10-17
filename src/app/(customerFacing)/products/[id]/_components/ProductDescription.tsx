import React from "react";
import {
  testProductDescription,
  testProductSpecification,
} from "@/lib/test-data";

type ProductDescriptionProps = {
  description?: string;
  specification?: {
    name: string;
    value: string;
  }[];
};

export default function ProductDescription({
  description,
  specification,
}: ProductDescriptionProps) {
  return (
    <div>
      <section className="my-8">
        <h2 className="text-balance text-center text-xl font-semibold">
          Description
        </h2>

        <p className="mx-auto max-w-[60ch] text-pretty">
          {description ? description : testProductDescription}
        </p>
      </section>

      <section className="text-center">
        <h2 className="text-balance text-xl font-semibold">Specification</h2>

        <table className="mx-auto mt-2 w-full max-w-[60ch] table-fixed border-collapse border-spacing-[1px] text-balance border border-[#dededf]">
          <caption className="sr-only">Product specification</caption>

          <thead>
            <tr className="bg-[#eceff1]">
              <th className="border px-4 py-1">Specification Name</th>
              <th className="border px-4 py-1">Value</th>
            </tr>
          </thead>

          <tbody>
            {(specification || testProductSpecification).map((spec, index) => (
              <tr key={`${spec.name}-${index}`}>
                <td className="border px-4 py-1">{spec.name}</td>
                <td className="border px-4 py-1">{spec.value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}
