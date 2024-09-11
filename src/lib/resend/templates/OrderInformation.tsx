import React from "react";
import dotenv from "dotenv";
import { dateFormatter, formatCurrency } from "@/lib/formatters";
import {
  Button,
  Column,
  Img,
  Row,
  Section,
  Text,
} from "@react-email/components";
import type { Order, Product } from "../types";
import type { DownloadVerification } from "@prisma/client";

dotenv.config();

type OrderInformationProps = {
  order: Order;
  product: Product;
  downloadVerification: DownloadVerification;
};

export default function OrderInformation({
  order,
  product,
  downloadVerification,
}: OrderInformationProps) {
  return (
    <>
      <Section>
        <Row>
          <Column>
            <Text className="mb-0 mr-4 whitespace-nowrap text-gray-500">
              Order ID
            </Text>
            <Text className="mr-4 mt-0">{order.id}</Text>
          </Column>

          <Column align="center">
            <Text className="mb-0 mr-4 whitespace-nowrap text-gray-500">
              Purchased On
            </Text>
            <Text className="mr-4 mt-0">{dateFormatter(order.createdAt)}</Text>
          </Column>

          <Column align="right">
            <Text className="mb-0 mr-4 whitespace-nowrap text-gray-500">
              Price Paid
            </Text>
            <Text className="mr-4 mt-0">
              {formatCurrency(order.pricePaidInCents / 100)}
            </Text>
          </Column>
        </Row>
      </Section>

      <Section className="my-4 rounded-lg border border-solid border-gray-500 p-4 md:p-6">
        <Img
          src={`${process.env.NEXT_PUBLIC_SERVER_URL}${product.imagePath}`}
          alt={product.name}
          width="100%"
        />

        <Row className="mt-8">
          <Column className="align-bottom">
            <Text className="m-0 mr-4 text-lg font-bold">{product.name}</Text>
          </Column>

          <Column align="right">
            <Button
              href={`${process.env.NEXT_PUBLIC_SERVER_URL}/products/download/${downloadVerification.id}`}
              className="rounded bg-black px-6 py-4 text-lg text-white"
            >
              Download
            </Button>
          </Column>
        </Row>

        <Row>
          <Column>
            <Text className="mb-0 text-gray-500">{product.description}</Text>
          </Column>
        </Row>
      </Section>
    </>
  );
}
