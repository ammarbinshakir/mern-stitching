import React, {useEffect, useState} from 'react'
import ImageSlider from "../../utils/ImageSlider";
import Axios from "axios";
import {Icon, Col, Row, Card, Button} from 'antd'
import CheckBox from "./Sections/CheckBox";
import RadioBox from "./Sections/RadioBox";
import {size, price } from './Sections/Datas'
import SearchFeature from "./Sections/SearchFeature";
// import './bg.png'

const { Meta } = Card;



function LandingPage() {

    const [Products, setProducts] = useState([])
    const [Skip, setSkip] = useState(0)
    const [Limit, setLimit] = useState(8)
    const [PostSize, setPostSize] = useState(8)

    const [SearchTerms, setSearchTerms] = useState("")

    const [Filters, setFilters] = useState({
        size:[],
        price:[]
    })


    useEffect(()=> {
        const variables = {
            skip: Skip,
            limit: Limit,
        }
        getProducts(variables)
    },[])

    const getProducts = (variables) => {
        Axios.post('/api/product/getProducts', variables)
            .then(response => {
                if (response.data.success){
                    if (variables.loadMore){
                        setProducts([...Products,...response.data.products])
                    } else {
                        setProducts(response.data.products)
                    }
                    // setProducts([...Products,...response.data.products])

                    setPostSize(response.data.postSize)
                    // console.log(response.data.products)
                } else {
                    alert('Failed to fetch products')
                }
            })
    }

    const onLoadMore =() =>{
        let skip = Skip + Limit

        const variables = {
            skip: skip,
            limit: Limit,
            loadMore: true
        }
        getProducts(variables)
        setSkip(skip)
    }

    const renderCards = Products.map((product, index)=> {
        return <Col key={index} lg={6} md={8} xs={24}>
            <Card
                hoverable={true}
                cover={<a href={`/product/${product._id}`} > <ImageSlider images={product.images} /></a>}
            >
                <Meta
                    title={product.title}
                    description={`$${product.price}`}
                />
            </Card>
        </Col>
    })


    const showFilteredResults = (filters) => {
        const variables = {
            skip: 0,
            limit: Limit,
            filters: filters
        }
        getProducts(variables)
        setSkip(0)
    }

    const handlePrice = (value) => {
        const data = price;
        let array = []

        for (let key in data) {
            // console.log('key',key)
            // console.log('value',value)
            if (data[key]._id === parseInt(value, 10)){
                array = data[key].array
            }
        }
        console.log('array', array)
        return array
    }

    const handleFilters = (filters, category) =>{
        // console.log(filters)
        const newFilters = {...Filters}
        // console.log(newFilters)
        newFilters[category] = filters

        if (category === 'price'){
             let priceValues = handlePrice(filters)
            newFilters[category]=priceValues
        }
        showFilteredResults(newFilters)
        setFilters(newFilters)
    }

    const updateSearchTerms = (newSearchTerm) => {


        console.log(newSearchTerm)
        const variables = {
            skip: 0,
            limit: Limit,
            filters: Filters,
            searchTerm: newSearchTerm
        }
        setSkip(0)
        setSearchTerms(newSearchTerm)

        getProducts(variables)

    }
    return (
        <div style={{marginTop: '-20px', backgroundImage : 'url(/images/bg.png)' , backgroundSize: '100% 450px', backgroundRepeat: 'no-repeat', backgroundPosition: 'top center', backgroundAttachment:'fixed'}}>
        <div style={{ width: '75%', margin: '3rem auto'}}>
            {/*<div style={{textAlign: 'center'}}>*/}
                {/*<h2>Welcome to Stitching <Icon type='rocket'/></h2>*/}
            {/*    <div style={{marginTop: '-20px', backgroundImage : 'url(/images/bg.png)' , backgroundSize: '100% 300px', backgroundRepeat: 'no-repeat'}}>*/}
            {/*    </div>*/}
            {/*</div>*/}
            {/*Filter   */}

            <Row gutter={[16,16]}>
                <Col lg={12} xs={24}>
                    <CheckBox
                        list={size}
                        handleFilters={filters => handleFilters(filters, 'size')}
                    />
                </Col>
                <Col lg={12} xs={24}>
                    <RadioBox
                        list={price}
                        handleFilters={filters => handleFilters(filters, 'price')}
                    />
                </Col>
            </Row>

            {/*Search*/}
            <div style={{ display:'flex', justifyContent:'flex-end', margin:'1rem auto'}}>
            <SearchFeature
                refreshFunction={updateSearchTerms}
            />
            </div>



            {/*Products*/}
            {Products.length === 0 ?
                <div style={{display: "flex", height: '300px', justifyContent: 'center', alignItems: 'center'}}>
                    <h2>No Products Yet....</h2>
                </div> :
                <div>
                    <Row gutter={[16, 16]}>
                        {renderCards}
                    </Row>

                </div>
            }
            <br/><br/>

            {PostSize >= Limit &&
            <div style={{display: 'flex', justifyContent: 'center'}}>
                <Button onClick={onLoadMore}>Load More</Button>
            </div>
            }

        </div>
        </div>
    )
}

export default LandingPage
