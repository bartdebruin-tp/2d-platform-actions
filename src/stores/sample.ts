import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

// Type definitie voor sample data
interface SampleData {
  sampleName: string
}

export const useSampleStore = defineStore('sample', () => {
  // State met expliciete typing
  const sampleName = ref<string>('Sample Name')

  // Actions met type-safe parameters en return types
  function exportSample(): SampleData {
    return {
      sampleName: sampleName.value,
    }
  }
  
  function loadSample(data: Partial<SampleData>): void {
    sampleName.value = data.sampleName || 'Sample Name'
  }

  // Getter met computed property
  const getSampleInfo = computed(() => ({
    name: sampleName.value,
    length: sampleName.value.length,
    isEmpty: sampleName.value.trim() === ''
  }))

  return {
    // State
    sampleName,
    // Getters
    getSampleInfo,
    // Actions
    exportSample,
    loadSample
  }
})