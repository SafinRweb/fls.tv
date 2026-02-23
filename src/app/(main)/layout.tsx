import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { LoadingProvider, PageLoadTrigger } from "@/components/layout/LoadingProvider";

export default function MainLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <LoadingProvider>
            <Navbar />
            <main className="flex-grow flex flex-col">
                {children}
            </main>
            <Footer />
            <PageLoadTrigger />
        </LoadingProvider>
    );
}
