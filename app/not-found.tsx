import { Button } from "@/components/ui/button"
import Link from "next/link"

const NotFound = () => {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center gap-y-10 bg-[radial-gradient(ellipse_at_top,#1b2735_30%,transparent_60%),conic-gradient(from_135deg,#8fd3f4_0%,#6b8df8_50%,#4a74e0_100%)] bg-cover bg-center bg-no-repeat">
        <h1 className="text-4xl text-white/80">I swear to god, you are not lost 
            <span className="text-6xl font-bold italic">, well maybe you are!</span>
            </h1>
            <Link href="/">
            <Button variant="custom" size="lg">Get back to home page</Button>
            </Link>
        </div>
  )
}

export default NotFound