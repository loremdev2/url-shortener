import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const LandingPage = () => {

  const [longUrl, setLongUrl] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if(longUrl){
      navigate(`/auth?createNew=${longUrl}`)
    }
  }

  return (
    <section className="px-4 py-12 sm:py-16 md:py-20 min-h-screen">
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight">
          The only
          <strong className="text-blue-600 font-extrabold"> URL Shortener </strong>
          you&rsquo;ll ever need 👇
        </h2>

        <form
          onSubmit={handleSubmit}
          className="mt-10 flex flex-col sm:flex-row items-center gap-4 w-full"
        >
          <Input
            id="url"
            type="text"
            value={longUrl}
            onChange={(e) => setLongUrl(e.target.value)}
            placeholder="Paste your long URL here..."
            className="flex-1"
            required
          />
          <Button size="lg" className="w-full sm:w-auto" type="submit">
            Shorten!
          </Button>
        </form>
      </div>

      <div className="max-w-2xl mx-auto mt-14">
        <Accordion type="single" collapsible className="w-full border rounded-lg shadow-sm p-5">
          <AccordionItem value="item-1">
            <AccordionTrigger>How does this URL shortener work?</AccordionTrigger>
            <AccordionContent>
              You paste a long URL, click “Shorten!”, and we generate a unique short link that redirects to your original URL.
              It’s fast, secure, and reliable.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger>Are the shortened URLs permanent?</AccordionTrigger>
            <AccordionContent>
              Yes! Once created, the shortened links remain active unless deleted manually (coming soon!) or flagged for abuse.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-3">
            <AccordionTrigger>Is there a limit to how many URLs I can shorten?</AccordionTrigger>
            <AccordionContent>
              Currently, there’s no limit for basic use. For high-volume usage or analytics, we'll be rolling out user accounts soon!
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-4">
            <AccordionTrigger>Can I track clicks or see analytics?</AccordionTrigger>
            <AccordionContent>
              Not yet, but analytics support is on the roadmap. Stay tuned for insights like click counts, locations, and more!
            </AccordionContent>
          </AccordionItem>
        </Accordion>

      </div>
    </section>
  )
}

export default LandingPage
