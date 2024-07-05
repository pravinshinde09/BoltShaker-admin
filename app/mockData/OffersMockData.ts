export type Offer = {
    id: number,
    title: string,
    date: string,
    image: string,
    discountCode:string,
    offerDetail:string
}

export const OFFERS_DATA: Offer[] = [
    {
        id: 1,
        title: 'Flat 15$ cashback on orders above.',
        date: '29 march 2024',
        image: 'https://images.pexels.com/photos/1707920/pexels-photo-1707920.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
        discountCode: '3121',
        offerDetail:'Flat 15$ cashback on orders above.Offer details can refer to the pricing and limitations for the use of software for a specific period.'
    },
    {
        id: 2,
        title: '20% OFF on all net banking transactions.',
        date: '29 march 2024',
        image: 'https://images.pexels.com/photos/1707920/pexels-photo-1707920.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
        discountCode: '31231',
        offerDetail:'10% OFF on first ever transaction using Gpay. Offer details can refer to the pricing and limitations for the use of software for a specific period.'
    },
    {
        id: 3,
        title: '10% OFF on first ever transaction using Gpay.',
        date: '29 march 2024',
        image: 'https://images.pexels.com/photos/1707920/pexels-photo-1707920.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
        discountCode: '3592345',
        offerDetail:'10% OFF on first ever transaction using Gpay.Offer details can refer to the pricing and limitations for the use of software for a specific period.'
    },
    {
        id: 4,
        title: 'CRED cashback offer of RS.10 upto RS.500',
        date: '29 march 2024',
        image: 'https://images.pexels.com/photos/1707920/pexels-photo-1707920.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
        discountCode: '35123123',
        offerDetail:'CRED cashback offer of RS.10 upto RS.500 . Offer details can refer to the pricing and limitations for the use of software for a specific period.'
    },
    {
        id: 5,
        title: '50% OFF on orders above 1499RS.',
        date: '29 march 2024',
        image: 'https://images.pexels.com/photos/1707920/pexels-photo-1707920.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
        discountCode: '3592341312',
        offerDetail:'50% OFF on orders above 1499RS. Offer details can refer to the pricing and limitations for the use of software for a specific period.'
    },
]
