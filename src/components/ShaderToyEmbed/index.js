import React from 'react';

const ShaderToyEmbed = ({id,title = "ShaderToy"}) => {
    return (
        <iframe
            src={'//www.shadertoy.com/embed/'+id}
            title={title}
            height="500"
            frameborder="0"
            marginwidth="0"
            marginheight="0"
            scrolling="no"
            style={{
                boxShadow: "0px 5px 10px rgb(0, 175, 255)",
                marginBottom: "10px",
                marginTop: "10px",
                width: "100%"
            }}
            allowfullscreen="true"
        />
    );
};

export default ShaderToyEmbed;