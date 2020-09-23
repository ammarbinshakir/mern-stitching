import React, {useState} from 'react';
import Axios from 'axios'
import { Typography, Button, Form, message, Input, Icon} from 'antd'
import FileUpload from '../../utils/FileUpload'

const {Title} = Typography
const {TextArea} = Input

const ProductSize = [
{key:1 , value: "sm"},
{key:2 , value: "md"},
{key:3 , value: "lg"},
{key:4 , value: "xl"}
]

const UploadProductPage = (props) => {

    const [TitleValue, setTitleValue] = useState("")
    const [DescValue, setDescValue] = useState("")
    const [PriceValue, setPriceValue] = useState(0)
    const [Size, setSize] = useState(1)
    const [Images, setImages] = useState([])

    const onTitleChange =(event) => {
        setTitleValue(event.currentTarget.value)
    }

    const onDescChange =(event) => {
        setDescValue(event.currentTarget.value)
    }

    const onPriceChange =(event) => {
        setPriceValue(event.currentTarget.value)
    }

    const onSizeChange =(event) => {
        setSize(event.currentTarget.value)
    }

    const updateImages =(newImages) =>{
        console.log(newImages)
        setImages(newImages)
    }

    const onSubmit = (event) => {
        event.preventDefault();


        if (!TitleValue || !DescValue || !PriceValue ||
            !Size || !Images) {
            return alert('fill all the fields first!')
        }

        const variables = {
            writer: props.user.userData._id,
            title: TitleValue,
            description: DescValue,
            price: PriceValue,
            images: Images,
            size: Size,
        }

        Axios.post('/api/product/uploadProduct', variables)
            .then(response => {
                if (response.data.success) {
                    alert('Product Successfully Uploaded')
                    props.history.push('/')
                } else {
                    alert('Failed to upload Product')
                }
            })
    }


    return (
        <div style={{ maxWidth: '700px', margin: '2rem auto'}}>
            <div style={{textAlign: 'center', marginBottom: '2rem'}}>
                <Title level={2}>Add New Product</Title>
            </div>

            <Form onSubmit={onSubmit}>
                {/*DropZOne*/}
                <FileUpload refreshFunction={updateImages}/>

                <br/>
                <br/>
                <label>Product Title</label>
                <Input
                    onChange={onTitleChange}
                    value={TitleValue}
                />
                <br/>
                <br/>
                <label>Product Description</label>
                <TextArea
                    onChange={onDescChange}
                    value={DescValue}
                />
                <br/>
                <br/>
                <label>Price($)</label>
                <Input
                    type="number"
                    onChange={onPriceChange}
                    value={PriceValue}
                />
                <select onChange={onSizeChange}>
                    {ProductSize.map(size => (
                        <option key={size.key} value={size.key}> {size.value}</option>
                    ))}

                </select>
                <br/>
                <br/>

                <Button onClick={onSubmit}>Submit</Button>

            </Form>

        </div>
    );
};

export default UploadProductPage;
