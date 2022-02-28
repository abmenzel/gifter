
const getData = async (id) => {
  /*const url = process.env.NODE_ENV === 'development' ? 'http://localhost:3000/api/test' : 'https://gavemanden.vercel.app/api/test'
  const config = {
      method: 'GET',
      headers: {
          'Content-Type': 'application/json'
      }
  }
  const res = await fetch(url, config)
  const data = await res.json()
  return data.find(item => item.handle === id)*/
  return {
    "handle": "vercel-test",
    "text": "Vercel test" 
  }
}

export async function getStaticProps({ params }) {
    const data = await getData(params.id)
    return {
      props: {
        data
      }
    }
  }

export async function getStaticPaths() {
    return {
      paths: [
        { params: { id: "vercel-test" } }
      ],
      fallback: true // false or 'blocking'
    };
  }

const Page = ({data}) => {
    return (
        <div>{data.text}</div>
    )
}

export default Page