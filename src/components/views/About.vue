<template>
    <b-row>
        <nav class="col-md-3 col-lg-2 d-md-block bg-light sidebar collapse border-right p-0">
            <div class="sidebar-sticky pt-3">
                &nbsp;
            </div>
        </nav>

        <main role="main" class="col-md-9 ml-sm-auto col-lg-10 px-md-4 pt-3">
            <div class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
                <h1 class="h2">About</h1>
            </div>
            <p>
            Linac is the result of the bachelor project of Erik Ravn Nikolajsen
            and Mamuna Azam, co-supervised by Gemma Di Federico and Andrea
            Burattin. The project is described in the document
            &ldquo;<em>A platform to simulate agent interactions with IoT devices
            to facilitate process mining algorithm research</em>&rdquo;.
            Abstract of the thesis:
            </p>

            <p class="font-italic pl-3">
            Solving the challenges that emerge from the integration of the
            internet of things and business process management require the
            research and development of novel techniques. The evaluation of these
            techniques necessitates access to simulated sensor data, that reflect
            known activities being performed by a human within various smart
            environments. This thesis describes the design process of an agent
            based smart home simulator, that allows for such data to be generated
            and published as a parsable MQTT stream. The simulator enables
            userdefinable environments via a formal markup language, sensor
            behaviour via an extensible backend, and activities via an application
            specific scripting language. The software agent was modeled to imitate
            human movement behaviour by the application of a suboptimal and
            nondeterministic pathfinding algorithm. Furthermore a webapplication
            was developed to act as a frontend for the simulation, which assists
            the user in defining the input, configuring the simulation, and
            viewing the output. The developed solution partially solves the
            aforementioned problem and paves the way for further research in the
            area by acting as a proof of concept.
            </p>
            <p>The complete report is availabe at: <a href="https://findit.dtu.dk/en/catalog/2691894192" target="_blank">https://findit.dtu.dk/en/catalog/2691894192</a>.</p>

            <p>The source code of this web-application is available at:</p>
            <ul>
            <li>Backend: <a href="https://github.com/DTU-SPE/linac-backend" target="_blank">https://github.com/DTU-SPE/linac-backend</a></li>
            <li>Frontend: <a href="https://github.com/DTU-SPE/linac-frontend" target="_blank">https://github.com/DTU-SPE/linac-frontend</a></li>
            </ul>
            <p>The documentation for the backend is available as <a href="https://editor.swagger.io/?url=https://raw.githubusercontent.com/DTU-SPE/linac-backend/main/RestAPI_Documentation.yaml" target="_blank">Swagger YAML file</a>. The API are currently hosted at DTU, and can be accessed at:</p>
            <ul>
            <li><code>linac.compute.dtu.dk</code> using <code>http</code></li>
            </ul>
            <p>The service is offered with no guarantees.</p>
        </main>
    </b-row>
</template>

<script>
export default {
  name: "About",
};
</script>
