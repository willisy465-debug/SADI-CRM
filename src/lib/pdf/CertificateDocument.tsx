import React from 'react';
import { Page, Text, View, Document, StyleSheet, Font } from '@react-pdf/renderer';

// Create styles
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#ffffff',
    padding: 40,
    border: '10px solid #10b981', // Emerald green border
  },
  innerBorder: {
    border: '2px solid #000000',
    flex: 1,
    padding: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    fontSize: 24,
    marginBottom: 20,
    color: '#000000',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  subHeader: {
    fontSize: 16,
    marginBottom: 40,
    color: '#666666',
    textAlign: 'center',
  },
  name: {
    fontSize: 32,
    marginBottom: 30,
    color: '#10b981',
    fontWeight: 'bold',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  text: {
    fontSize: 14,
    marginBottom: 10,
    color: '#000000',
    textAlign: 'center',
  },
  programmeTitle: {
    fontSize: 20,
    marginVertical: 20,
    fontWeight: 'bold',
    color: '#000000',
    textAlign: 'center',
  },
  footer: {
    position: 'absolute',
    bottom: 50,
    left: 40,
    right: 40,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  signatureLine: {
    borderTop: '1px solid #000000',
    width: 200,
    marginTop: 50,
    paddingTop: 10,
    textAlign: 'center',
    fontSize: 12,
  }
});

interface CertificateProps {
  delegateName: string;
  programmeTitle: string;
  date: string;
}

export const CertificateDocument = ({ delegateName, programmeTitle, date }: CertificateProps) => (
  <Document>
    <Page size="A4" orientation="landscape" style={styles.page}>
      <View style={styles.innerBorder}>
        <Text style={styles.header}>SOUTHERN AFRICA DEVELOPMENT INSTITUTE</Text>
        <Text style={styles.subHeader}>CERTIFICATE OF COMPLETION</Text>
        
        <Text style={styles.text}>This is to certify that</Text>
        
        <Text style={styles.name}>{delegateName}</Text>
        
        <Text style={styles.text}>has successfully completed the training programme titled:</Text>
        
        <Text style={styles.programmeTitle}>{programmeTitle}</Text>
        
        <Text style={styles.text}>Completed on: {date}</Text>
        
        <View style={styles.footer}>
          <View>
            <Text style={styles.signatureLine}>SADI Director</Text>
          </View>
          <View>
            <Text style={styles.signatureLine}>Lead Facilitator</Text>
          </View>
        </View>
      </View>
    </Page>
  </Document>
);
