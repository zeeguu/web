// ArticleCardPlaceholder.jsx
import React from 'react';
import { CardContainer, Header, Icon, Content, Title, Summary, SummaryText, Footer } from './ArticleCard.cs.js';

export default function ArticleCard() {
    return (
        <CardContainer>
            <Header>
                Image
            </Header>

            <Content>
                <Title>Article Title</Title>
                <Summary>
                    <SummaryText>
                        This is a placeholder for an article summary. Replace with actual content when available.
                    </SummaryText>
                </Summary>
                <Footer>from Placeholder Source</Footer>
            </Content>
        </CardContainer>
    );
}
