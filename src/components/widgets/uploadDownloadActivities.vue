<template>
  <b-list-group flush>
    <b-list-group-item>
      <p>Download the Json of the simulation</p>
      <b-button @click="download">Download</b-button>
    </b-list-group-item>
    
    <b-list-group-item>
      <p>Upload the simulation from Json file</p>
      <b-form-file
        v-model="JsonFile"
        :state="Boolean(JsonFile)"
        accept=".json"
        placeholder="Choose a file or drop it here..."
        drop-placeholder="Drop file here..."
        class="mb-2"
      ></b-form-file>
      <b-button @click="uploadJSON">Upload Json file</b-button>
    </b-list-group-item>
    
    <b-list-group-item>
      <p>Upload the simulation from plain text file</p>
      <b-form-file
        v-model="TextFile"
        :state="Boolean(TextFile)"
        accept=".txt"
        placeholder="Choose a file or drop it here..."
        drop-placeholder="Drop file here..."
        class="mb-2"
      ></b-form-file>
      <b-button @click="uploadText">Upload text file</b-button>
      <p :v-if="messageFromUpload.length > 0">{{ messageFromUpload }}</p>
    </b-list-group-item>
  </b-list-group>
  <!-- <div>
    <v-card class="mx-auto" max-width="500" outlined elevation="2" shaped>
      <v-card-title
        >Upload or Download the Activities
        <br />
        <v-btn text @click="close"> &times; </v-btn>
      </v-card-title>
      <v-card-text>
        <v-file-input
          accept=".json"
          label="Select Json File"
          outlined
          v-model="JsonFile"
        >
        </v-file-input>
        <v-file-input
          accept=".txt"
          label="Select Text File"
          outlined
          v-model="TextFile"
        >
        </v-file-input>
        <v-btn outlined rounded text @click="uploadJSON">
          Upload JSON File</v-btn
        >
        <v-btn outlined rounded text @click="uploadText">
          Upload Text File</v-btn
        >
        <v-btn outlined rounded text @click="download"> Download</v-btn>
        <br />
        {{ messageFromUpload }}
      </v-card-text>
    </v-card>
  </div> -->
</template>

<script>
import exportFromJSON from "export-from-json";
import * as validator from "is-my-json-valid";
export default {
  name: "UploadDownloadActivities",
  data() {
    return {
      JsonFile: null,
      TextFile: null,
      messageFromUpload: "",
      dataJson: null,
      dataText: null,
    };
  },
  methods: {
    close() {
      this.$emit("closeCard");
    },
    uploadJSON() {
      if (!this.JsonFile) {
        this.messageFromUpload = "No JSON File Chosen";
      } else {
        var reader = new FileReader();
        reader.readAsText(this.JsonFile);
        reader.onload = () => {
          this.dataJson = reader.result;
        };
        setTimeout(() => {
          this.valid();
        }, 1500);
      }
    },
    uploadText() {
      if (!this.TextFile) {
        this.messageFromUpload = "No Text File Chosen";
      } else {
        var reader = new FileReader();
        reader.readAsText(this.TextFile);
        reader.onload = () => {
          this.dataText = reader.result;
        };
        this.messageFromUpload = "Success";
        setTimeout(() => {
            this.updateInput(this.dataText);
            this.$router.go();
        }, 1500);
      }
    },
    updateInput(text) {
      this.$store.commit("updateActivities", text);
    },
    download() {
      let data = {
        input: this.$store.state.activities,
      };
      const fileName = "activities";
      const exportType = "json";
      exportFromJSON({ data, fileName, exportType });
    },
    valid() {
      var validate = validator({
        required: true,
        type: "object",
        properties: {
          input: {
            type: "string",
            required: true,
          },
        },
      });

      try {
        let json = JSON.parse(this.dataJson);
        let isValid = validate(json);
        if (!isValid) {
          this.messageFromUpload = JSON.stringify(validate.errors);
        } else {
          this.updateInput(json.input);
          this.messageFromUpload = "Success";
          //refresh page
          this.$router.go();
        }
      } catch (err) {
        this.messageFromUpload = err;
      }
    },
  },
  watch: {
    JsonFile: function () {
      this.messageFromUpload = "";
    },
    TextFile: () => {
      this.messageFromUpload = "";
    },
  },
};
</script>
