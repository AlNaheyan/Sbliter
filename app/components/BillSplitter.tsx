"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";

interface Person {
  name: string;
  amountPaid: number;
}

export default function BillSplitter() {
  const [totalBill, setTotalBill] = useState("");
  const [people, setPeople] = useState<Person[]>([]);
  const [name, setName] = useState("");
  const [amountPaid, setAmountPaid] = useState("");
  const [transactions, setTransactions] = useState<string[]>([]);

  const addPerson = () => {
    if (!name) return; // Allow amountPaid = 0, but name is required
    setPeople([...people, { name, amountPaid: parseFloat(amountPaid) || 0 }]);
    setName("");
    setAmountPaid("");
  };

  const calculateSplit = () => {
    if (people.length === 0 || !totalBill) return;

    const bill = parseFloat(totalBill);
    const share = bill / people.length;
    const balances = people.reduce<Record<string, number>>(
      (acc, person) => ({ ...acc, [person.name]: person.amountPaid - share }),
      {}
    );

    const trans: string[] = [];
    
    while (Object.values(balances).some((bal) => Math.abs(bal) > 0.01)) {
      const payer = Object.keys(balances).reduce((a, b) => (balances[a] < balances[b] ? a : b));
      const receiver = Object.keys(balances).reduce((a, b) => (balances[a] > balances[b] ? a : b));

      const amount = Math.min(Math.abs(balances[payer]), Math.abs(balances[receiver]));
      trans.push(`${payer} should pay ${receiver} $${amount.toFixed(2)}`);

      balances[payer] += amount;
      balances[receiver] -= amount;
    }

    setTransactions(trans);
  };

  return (
    <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.5, ease: "easeOut" }}
    >
        <Card className="w-full max-w-md mx-auto p-4 mt-10 shadow-lg">
        <CardHeader className="justify-center mt-4">
            <CardTitle className="text-3xl center"> Bill Splitter</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
            <Input
            type="number"
            placeholder="Total Bill Amount ($)"
            value={totalBill}
            onChange={(e) => setTotalBill(e.target.value)}
            />
            
            <div className="flex space-x-2">
            <Input
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
            />
            <Input
                type="number"
                placeholder="Amount Paid ($)"
                value={amountPaid}
                onChange={(e) => setAmountPaid(e.target.value)}
            />
            <Button onClick={addPerson}>Add</Button>
            </div>

            <ul className="text-sm text-gray-600">
            {people.map((p, idx) => (
                <li key={idx}>
                {p.name} paid ${p.amountPaid.toFixed(2)}
                </li>
            ))}
            </ul>

            <Button onClick={calculateSplit} className="w-full">Calculate</Button>

            {transactions.length > 0 && (
            <div className="mt-4">
                <h3 className="font-semibold">Transactions:</h3>
                <ul className="text-sm text-gray-700">
                {transactions.map((t, idx) => (
                    <li key={idx}>{t}</li>
                ))}
                </ul>
            </div>
            )}
        </CardContent>
        </Card>
    </motion.div>
  );
}
