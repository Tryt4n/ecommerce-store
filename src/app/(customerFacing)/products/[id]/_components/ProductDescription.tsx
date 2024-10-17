import React from "react";

type ProductDescriptionProps = {
  description?: string;
  specification?: {
    name: string;
    value: string;
  }[];
};

const testProductSpecification: NonNullable<
  ProductDescriptionProps["specification"]
> = [
  {
    name: "Specification Name 1",
    value: "Specification Value 1",
  },
  {
    name: "Specification Name 2",
    value: "Specification Value 2",
  },
  {
    name: "Specification Name 3",
    value: "Specification Value 3",
  },
  {
    name: "Specification Name 4",
    value: "Specification Value 4",
  },
];

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
          {description
            ? description
            : "Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Vestibulum tortor quam, feugiat vitae, ultricies eget, tempor sit amet, ante. Donec eu libero sit amet quam egestas semper. Aenean ultricies mi vitae est. Mauris placerat eleifend leo. Quisque sit amet est et sapien ullamcorper pharetra. Vestibulum erat wisi, condimentum sed, commodo vitae, ornare sit amet, wisi. Aenean fermentum, elit eget tincidunt condimentum, eros ipsum rutrum orci, sagittis tempus lacus enim ac dui. Donec non enim in turpis pulvinar facilisis. Ut felis. Praesent dapibus, neque id cursus faucibus, tortor neque egestas augue, eu vulputate magna eros eu erat. Aliquam erat volutpat. Nam dui mi, tincidunt quis, accumsan porttitor, facilisis luctus, metus"}
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
