import { CompiledCircuit } from "@noir-lang/types";
import { BarretenbergBackend } from "@noir-lang/backend_barretenberg";
import { Noir } from "@noir-lang/noir_js";
import { readFileSync } from "fs";

import circuit from "../target/dkim.json"
import toml from "toml"

const main = async () => {
  const data = toml.parse(readFileSync("./dkim/Prover.toml", "utf8"))

  console.log(JSON.stringify(data, null, 2))
  const backend = new BarretenbergBackend(
    circuit as unknown as CompiledCircuit,
    { threads: 8 },
  );
  const noir = new Noir(circuit as unknown as CompiledCircuit, backend);

  const { witness, returnValue } = await noir.execute(data, async (name, args) => Promise.resolve([]))
  
  const proof = await backend.generateFinalProof(witness)
  return proof;
}

main()
