import React, {useState} from 'react';
import { Page, Text, Document, StyleSheet} from '@react-pdf/renderer';
import ReactPDF from '@react-pdf/renderer';

const rfpData = {
    initialValues: {
        name_person: this.props.name_person,
        position: this.props.position,
        phone: this.props.phone,
        email: this.props.email,
        rfpname: this.props.rfpname,
        objective: this.props.objective,
        imp_dates: this.props.imp_dates,
        problem: this.props.problem,
        functional: this.props.functional,
        requirements: this.props.requirements,
        tipo_general: this.props.tipo_general,
        tipo_esp: this.props.tipo_esp,
        comment: this.props.comment,
     }
}

const RFP = () => (
    <Document>
       <Page style={styles.body} >
           <Text style={styles.title}>Oportunidad Comercial </Text> 
             <Text style={styles.subtitle}> Datos generales</Text>
             <Text style={styles.questions}> Nombre de la oportunidad:</Text>
             <Text>{rfpData.rfpname}</Text>
             <Text style={styles.questions}>Objetivo de la oportunidad:</Text>
             <Text>{rfpData.objective}</Text>
             <Text style={styles.questions}>Fechas relevantes: </Text>
             <Text>{rfpData.imp_dates}</Text>
             <Text style={styles.questions}>Descripción de la problemática:</Text>
             <Text>{rfpData.problem}</Text>
             <Text> </Text>
             <Text style={styles.subtitle}>Detalle de la oportunidad</Text>
             <Text style={styles.questions}> Descripción funcional de la oportunidad</Text>
             <Text>{rfpData.functional}</Text>
             <Text style={styles.questions}>Requerimientos obligatorios: </Text>
             <Text>{rfpData.requirements}</Text>
             <Text> </Text>
             <Text style={styles.subtitle}> Estatus de la necesidad</Text>
             <Text style={styles.questions}>Tipo general del proyecto:</Text>
             <Text>{rfpData.tipo_general}</Text>
             <Text style={styles.questions}>Tipo específico del proyecto: </Text>
             <Text>{rfpData.tipo_esp}</Text>
             <Text style={styles.questions}>Comentarios adicionales:</Text>
             <Text>{rfpData.comment}</Text>
             <Text> </Text>
            <Text style={styles.subtitle}>Datos de contacto</Text>
            <Text style={styles.questions}>Nombre de la persona: </Text>
            <Text>{rfpData.name_person}</Text>
            <Text style={styles.questions}>Posición: </Text>
            <Text>{rfpData.position}</Text>
            <Text style={styles.questions}>Teléfono: </Text>
            <Text>{rfpData.phone}</Text>
            <Text style={styles.questions}>Correo electrónico</Text>
            <Text>{rfpData.email}</Text>
         <Image style={styles.image}
        src="/Img/csoft.png"></Image>  
       </Page>
     </Document>
 );
 
 Font.register({
   family: 'Oswald',
   src: 'https://fonts.gstatic.com/s/oswald/v13/Y_TKV6o8WovbUd3m_X9aAA.ttf'
 });
 
 const styles = StyleSheet.create({
   body: {
     paddingTop: 45,
     paddingBottom: 65,
     paddingHorizontal: 35,
     fontSize: 15,
   },
   title: {
     fontSize: 45,
     textAlign: 'center',
     fontFamily: 'Oswald',
     marginBottom: 15,
   },
   questions:{
     fontWeight: 'bold',
     fontSize: 17,
   },
 
   subtitle: {
     fontSize: 20,
     fontFamily: 'Oswald',
     
   },
   image: {
     marginVertical: 15,
     marginHorizontal: 100,
   },
 
 });
 
 ReactPDF.render(<RFP/>);