import Image from "next/image";

const AboutUs = () => {
  return (
    <section className="mx-auto max-w-7xl px-4 sm:mt-6 sm:px-6 lg:mt-8 lg:px-8">
      <div className="lg:flex-justify mx-auto my-10 flex max-w-7xl flex-col gap-3 px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:flex lg:flex-row lg:px-8 xl:mt-28">
        <div className="sm:text-center lg:text-left">
          <h1 className="text-4xl font-extrabold tracking-tight text-gray-800 sm:text-5xl md:text-6xl">
            <span className="block xl:inline">Data to enrich your</span>
            <span className="block text-indigo-600 xl:inline">
              online business
            </span>
          </h1>
          <p className="mt-3 text-base text-gray-500 sm:mx-auto sm:mt-5 sm:max-w-xl sm:text-lg md:mt-5 md:text-xl lg:mx-0">
            Anim aute id magna aliqua ad ad non deserunt sunt. Qui irure qui
            lorem cupidatat commodo. Elit sunt amet fugiat veniam occaecat
            fugiat aliqua.
          </p>
          <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
            <div className="rounded-md shadow">
              <a
                href="#"
                className="flex w-full items-center justify-center rounded-md border border-transparent bg-gray-800 px-8 py-3 text-base font-medium text-white hover:bg-gray-600 md:px-10 md:py-4 md:text-lg"
              >
                Get started
              </a>
            </div>
            <div className="mt-3 sm:ml-3 sm:mt-0">
              <a
                href="#"
                className="flex w-full items-center justify-center rounded-md border border-transparent bg-indigo-100 px-8 py-3 text-base font-medium text-gray-800 hover:bg-indigo-200 md:px-10 md:py-4 md:text-lg"
              >
                Live demo
              </a>
            </div>
          </div>
        </div>

        <div className="my-4 lg:inset-y-0 lg:right-0 lg:w-1/2">
          <Image
            className="h-56 w-full object-cover sm:h-72 md:h-96 lg:h-full lg:w-full"
            src="/fingerprint.jpg"
            alt="Fingerprint"
            width={1200}
            height={1200}
          />
        </div>
      </div>
    </section>
  );
};

export default AboutUs;
