import React, { useState } from 'react';
import { Nav, Tab } from 'react-bootstrap';
import './TabList.scss';
import '../../app/styles/colors.scss';

const TabList = ({ tabs }) => {
    const [activeKey, setActiveKey] = useState(tabs[0].key);

    return (
        <div className="custom-tab-list">
            <Tab.Container activeKey={activeKey} onSelect={(k) => setActiveKey(k)}>
                <Nav className="tab-nav mb-4">
                    {tabs.map((tab) => (
                        <Nav.Item key={tab.key}>
                            <Nav.Link 
                                eventKey={tab.key} 
                                className={`tab-link ${activeKey === tab.key ? 'active' : ''}`}
                            >
                                {tab.title}
                            </Nav.Link>
                        </Nav.Item>
                    ))}
                </Nav>
                <Tab.Content className="tab-content">
                    {tabs.map((tab) => (
                        <Tab.Pane key={tab.key} eventKey={tab.key}>
                            {tab.content}
                        </Tab.Pane>
                    ))}
                </Tab.Content>
            </Tab.Container>
        </div>
    );
};

export default TabList;
