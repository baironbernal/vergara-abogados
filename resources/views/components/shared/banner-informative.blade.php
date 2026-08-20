@props(['picture' => '', 'title' => '', 'description' => ''])

<section class="relative w-full h-auto"
         style="background-image: url('{{ $picture }}'); background-size: cover; background-position: center; background-repeat: no-repeat; height: 250px;">
    <div class="absolute w-full h-full">
        <div class="container flex flex-col items-center justify-center w-full h-full gap-3 px-4 mx-auto text-center lg:gap-4 lg:px-8">
            <h1 class="text-3xl font-medium tracking-wider font-prata text-whiteki sm:text-4xl md:text-5xl lg:text-6xl">{{ $title }}</h1>
            <p class="px-4 text-sm text-golden sm:text-base md:px-2 lg:text-lg">{{ $description }}</p>
        </div>
    </div>
</section>
