import CodeEditor from "@/components/codeEditor";

import { Button } from "@nextui-org/button";

export default function Home() {
  return (
    <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">

      <CodeEditor></CodeEditor>
      <Button className="bg-primary w-[400px] ">Submit</Button>
    </section>
  );
}
