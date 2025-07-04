import Feature from "./feature.interface"

export default interface Article{
  id: number,
  title: string
  description: string
  image: string
  fullPrice: number
  discountPercent: number
  category: string
  features: Feature[]
}
