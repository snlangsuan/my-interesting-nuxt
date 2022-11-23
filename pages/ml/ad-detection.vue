<template>
  <div class="ad-detection-page">
    <div class="ad-detection__container">
      <v-card>
          <v-card-title class="py-2">
            <div>Artwork</div>
            <v-spacer />
            <v-btn icon><v-icon>mdi-dots-vertical</v-icon></v-btn>
          </v-card-title>
          <v-divider />
          <v-card-text>
            <div v-if="databases.length > 0">{{ databases.length }} Image samples</div>
            <div v-else>Add Image samples:</div>
            <div class="ad-detection-database">
              <div class="ad-detection-upload-btn" @click="uploadDatabaseDialog = true">
                <v-icon size="18">mdi-tray-arrow-up</v-icon>
                <div class="ad-detection-upload-btn__text">Upload</div>
              </div>
              <div class="ad-detection-database-list">
                <template v-for="item in databases">
                  <div :key="item.id" class="ad-detection-database-item"></div>
                </template>
              </div>
            </div>
          </v-card-text>
        </v-card>
    </div>
    <!-- <v-container>
      <v-row>
        <v-col cols="12">
          <v-card>
            <v-card-title>
              <div>Artwork</div>
              <v-spacer />
              <v-btn icon><v-icon>mdi-close</v-icon></v-btn>
            </v-card-title>
            <v-divider />
            <v-card-text>

            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container> -->
    <v-dialog v-model="uploadDatabaseDialog" max-width="480" persistent>
      <v-card>
        <v-card-title>Add new artwork</v-card-title>
        <v-card-text>
          <v-form ref="database_form" v-model="createDatabaseValid" @submit.prevent>
            <v-text-field v-model="createDatabase.label" label="Label" :rules="[(x) => !!x || 'Enter label name']" dense outlined />
            <upload-image-field ref="upload_database" v-model="createDatabase.img" :rules="[(x) => !!x || 'Enter image']" add-text="คลิกหรือลากวาง" accept="image/jpeg" style="width: 100%" />
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn text @click="uploadDatabaseDialog = false">cancel</v-btn>
          <v-btn color="primary" text @click="handleAddDatabase">add</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  name: 'AdDetectionPage',
  layout: 'ml',
  data() {
    return {
      title: 'Ad Detection',
      databases: [],
      uploadDatabaseDialog: false,
      createDatabaseValid: true,
      createDatabase: {
        label: '',
        img: ''
      }
    }
  },
  head() {
      return {
        title: this.title,
      }
  },
  watch: {
    uploadDatabaseDialog(val) {
      this.$nextTick(() => {
        this.$refs.database_form.resetValidation()
      })
    },
  },
  methods: {
    handleAddDatabase() {
      if (!this.$refs.database_form.validate()) return
      console.log('upload', this.createDatabase)
      const raw = this.$refs.upload_database.getOriginalFile()
      console.log('raw', raw)
      this.databases.push({
        id: Date.now(),
        img: this.createDatabase.img,
        label: this.createDatabase.label,
      })
    }
  },
}
</script>

<style lang="scss" scoped>
.ad-detection {
  &-page {
    padding: 8px;
  }
  &-database {
    padding-top: 8px;

    &-list {
      overflow: hidden;
      overflow-x: auto;
    }

    &-item {
      width: 58px;
      height: 58px;
    }
  }
  &__container {
    max-width: 640px;
    width: 100%;
    margin: auto;
  }
  &-upload-btn {
    width: 72px;
    height: 58px;
    padding: 4px 8px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-color: #E8F0FE;
    border-radius: 4px;
    cursor: pointer;
    position: relative;

    & > input {
      display: none;
    }

    & > i,
    & > &__text {
      color: #1967d2;
    }

    & > &__text {
      font-size: 0.8rem;
    }

    &:hover {
      background-color: #D2E3FC;
    }
  }
}
</style>
