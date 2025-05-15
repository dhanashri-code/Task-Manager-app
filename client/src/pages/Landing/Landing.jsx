import Navbarr from "../../component/Navbarr";
import { motion } from "framer-motion";
import homeImg from "../../assets/homeImg.png";
import { Button, Card, Row, Col } from "antd";
import { Link } from 'react-router-dom';
import "antd/dist/reset.css";
export default function Landing() {

    return (
        <>
            <Navbarr />

            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                style={{backgroundColor:"#f1f1f1"}}
            >
                <Card className="shadow-lg" style={{ height: "100vh", maxWidth: "100vw", width: "100%", padding: "50px", borderRadius: "12px" }}>
                    <Row align="middle" gutter={[16, 16]} justify="center">
                        <Col xs={24} md={14}>
                            <h1 className="fw-bold text-dark">Welcome to TaskMaster</h1>
                            <p className="mt-3 text-secondary fs-5">
                                Organize your tasks efficiently and boost your productivity with our easy-to-use task management system.
                            </p>
                            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                <Link to="/register">
                                <Button type="primary" size="large" className="mt-4">
                                    Get Started
                                </Button>
                                </Link>
                            </motion.div>
                        </Col>
                        <Col xs={24} md={10} className="text-center">
                            <img
                                src={homeImg}
                                alt="Task Management"
                                className="rounded"
                                style={{ maxWidth: "100%", height: "auto" }}
                            />
                        </Col>
                    </Row>
                </Card>
            </motion.div>



        </>
    )
}