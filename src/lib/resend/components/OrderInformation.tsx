import React from "react";
import dotenv from "dotenv";
import { dateFormatter, formatCurrency } from "@/lib/formatters";
import { Column, Img, Row, Section, Text } from "@react-email/components";
import type { PurchaseReceiptEmailProps } from "../templates/PurchaseReceiptEmail";

dotenv.config();

type OrderInformationProps = PurchaseReceiptEmailProps;

export default function OrderInformation({ order }: OrderInformationProps) {
  return (
    <>
      <Section>
        <Row>
          <Column>
            <Text className="m-0 mr-4 whitespace-nowrap text-gray-500">
              Order ID
            </Text>
            <Text className="mr-4 mt-0">{order.id}</Text>
          </Column>

          <Column align="center">
            <Text className="m-0 mr-4 whitespace-nowrap text-gray-500">
              Purchased On
            </Text>
            <Text className="mr-4 mt-0">{dateFormatter(order.createdAt)}</Text>
          </Column>

          <Column align="right">
            <Text className="m-0 whitespace-nowrap text-gray-500">
              Price Paid
            </Text>
            <Text className="mr-4 mt-0">
              {formatCurrency(order.pricePaidInCents / 100)}
            </Text>
          </Column>
        </Row>
      </Section>

      {order.orderItems.map((orderProduct) => (
        <Section
          key={orderProduct.id}
          className="my-4 rounded-lg border border-solid border-gray-500 p-4 md:p-6"
        >
          <Img
            src={orderProduct.product.images[0].url}
            alt={orderProduct.product.name}
            width="100%"
          />

          <Row className="mt-8">
            <Column className="align-bottom">
              <Text className="m-0 mr-4 text-lg font-bold">
                {orderProduct.product.name}
              </Text>
            </Column>
          </Row>

          <Row>
            <Column>
              <Text className="m-0">
                {formatCurrency(orderProduct.product.priceInCents / 100)}
                {orderProduct.quantity > 1 ? (
                  <span className="text-base">
                    &nbsp;&nbsp;&nbsp;x{orderProduct.quantity}
                  </span>
                ) : (
                  ""
                )}
              </Text>
            </Column>

            {orderProduct.quantity > 1 && (
              <Column align="right">
                <Text className="m-0">
                  {formatCurrency(
                    (orderProduct.product.priceInCents *
                      orderProduct.quantity) /
                      100
                  )}
                </Text>
              </Column>
            )}
          </Row>

          <Row>
            <Column>
              <Text className="mb-0 text-gray-500">
                {orderProduct.product.description}
              </Text>
            </Column>
          </Row>
        </Section>
      ))}
    </>
  );
}
