import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Copy } from "lucide-react";

export default function NotRealPaymentInfo() {
  return (
    <section className="mb-4">
      <Accordion type="multiple">
        <AccordionItem
          value="not-real-payments-info"
          className="border-b-0 text-destructive"
        >
          <AccordionTrigger chevronSize={18} className="p-0">
            <h3 className="text-balance text-start">
              <b>
                This is not a real payment. It works like a real payment, but it
                will not charge any card.
              </b>
            </h3>
          </AccordionTrigger>

          <AccordionContent className="mt-2 flex flex-col gap-2 border-b">
            <p>
              <b>Disclaimer</b>: This is not a real payment system. No actual
              bank accounts or credit cards will be charged. The data provided
              is purely for demonstration purposes.
            </p>
            <p>
              <b>Please note</b>: This website is a personal project and not a
              real online store. Any transactions you make here are for testing
              and demonstration purposes only.
            </p>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem
          value="card-testing-data"
          className="border-b-0 text-chart-5"
        >
          <AccordionTrigger chevronSize={18}>
            <p className="text-balance text-start">Click to see test data:</p>
          </AccordionTrigger>

          <AccordionContent className="mb-4 flex flex-col gap-2">
            <p className="text-pretty">
              <b>The expiration date must be any future date.</b>
            </p>
            <p className="text-pretty">
              <b>CVC number must be any 3-digit number.</b>
            </p>

            <ExampleCardData label="US card" cardNumber="4242 4242 4242 4242" />
            <ExampleCardData label="PL card" cardNumber="4000 0061 6000 0005" />
            <ExampleCardData
              label="Decline payment"
              cardNumber="4000 0000 0000 0002"
            />
            <ExampleCardData
              label="Insufficient funds decline"
              cardNumber="4000 0000 0000 9995"
            />
            <ExampleCardData
              label="Expired card decline"
              cardNumber="4000 0000 0000 0069"
            />
            <ExampleCardData
              label="Incorrect CVC decline"
              cardNumber="4000 0000 0000 0127"
            />
            <ExampleCardData
              label="Exceeding velocity limit decline"
              cardNumber="4000 0000 0000 6975"
            />

            <a
              href="https://docs.stripe.com/testing"
              target="_blank"
              aria-label="Stripe testing documentation"
              className="text-pretty underline transition-colors hover:text-muted-foreground"
            >
              Click to see other payments methods
            </a>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </section>
  );
}

function ExampleCardData({
  label,
  cardNumber,
}: {
  label: string;
  cardNumber: string;
}) {
  function copyToClipboard(text: string) {
    navigator.clipboard.writeText(text.replace(/ /g, ""));
  }

  return (
    <p className="flex flex-row items-center text-pretty">
      {label}:&nbsp;
      <span className="text-nowrap">{cardNumber}</span>
      <button
        type="button"
        className="ml-1 transition-colors hover:text-muted-foreground"
        onClick={() => copyToClipboard(cardNumber)}
      >
        <Copy size={14} />
        <span className="sr-only">Copy</span>
      </button>
    </p>
  );
}
